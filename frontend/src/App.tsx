import { useEffect, useRef, useState } from 'react'
import type { Message } from './types/Chat';
import './App.css'
import axios from 'axios';

function App() {

  
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [inputText, setInputText] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const existingSessionId = localStorage.getItem('chat_session_id')
    if (existingSessionId) {
      setSessionId(existingSessionId)

      const fetchHistory = async (sId: string) => {
        try {
          const response = await axios.post(`${apiUrl}/chat/history`, {
            sessionId: sId
          })
          if (response.data.success) {
            shouldAutoScrollRef.current = true;
            setMessages(response.data.data);
            setNextCursor(response.data.nextCursor);
          }
        } catch(err) {
          console.log('Error: ',err);
          throw err;
        }
      }
      fetchHistory(existingSessionId);
    } 
  }, [])

  useEffect(() => { 
    if (shouldAutoScrollRef.current) {
      scrollTobottom();
    }
  }, [messages])

  const handleSend = async () => {
    if(!inputText.trim()) return;
    const tmpUsrMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'User',
      createdAt: new Date().toISOString(),
      status: 'sending'
    }
    shouldAutoScrollRef.current = true;
    setMessages(prev => [...prev, tmpUsrMsg]);
    const msgToSend = inputText;
    setInputText('');
    setIsAITyping(true);
    try {
      const res = await axios.post(`${apiUrl}/chat/message`, {
        message: msgToSend,
        sessionId: sessionId || undefined
      })
      if (res.data.reply) {
        const aiReply = res.data.reply;
        setMessages(prev => [...prev, aiReply]);
      };
      if (!sessionId && res.data.sessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem('chat_session_id', res.data.sessionId)
      };

    } catch (err) {
      console.log('Error: ',err);
    } finally {
      setIsAITyping(false);
    }
  }

  const loadMoreMsg = async () => {
    const container = messageContainerRef.current;
    if (!nextCursor || !container || isLoadingMore) return;
    setIsLoadingMore(true);
    const prevScrollHeight = container.scrollHeight;
    shouldAutoScrollRef.current = false;

    try {
      const res = await axios.post(`${apiUrl}/chat/history`, {
        sessionId,
        cursor: nextCursor
      })
      if (res.data.success) {
        if(res.data.data.length === 0) {
          setNextCursor(null);
          return;
        }
        setMessages(prev => [...res.data.data, ...prev]);
        setNextCursor(res.data.nextCursor);

        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        })
      }
    } catch (err) {
      console.log('Error: ',err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const scrollTobottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView();
    }, 2000)
  }

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;

    if(container.scrollTop <= 20 && nextCursor && !isAITyping && !isLoadingMore) {
      loadMoreMsg();
    }
  }

  return (
    <div className='flex flex-col h-screen gap-2 py-4 px-2 lg:py-8 justify-center items-center'>
      <h1 className='text-2xl font-semibold'>Customer Support Chat</h1>
      <div className='bg-gray-300 h-full w-full max-w-4xl md:rounded-2xl shadow-lg flex flex-col'>

        <div 
          ref={messageContainerRef}
          onScroll={handleScroll}
          className='flex flex-col flex-1 overflow-y-auto gap-2 p-4'
        >
          {true && (
            <p
              className='text-sm lg:text-xl border-b py-2 border-gray-400 shadow '
            >Hey, Welcome to the Customer Support! How may I help you ?</p>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`px-4 py-2 text-sm lg:text-lg rounded-2xl shadow max-w-[70%] text-start wrap-break-words overflow-hidden whitespace-pre-wrap ${msg.sender === 'User' ? 'bg-blue-200' :  'bg-blue-100'}`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {msg.text}
              </p>
            </div>
          ))}

          {isAITyping && (
            <div className="flex justify-start">
              <p className="px-4 py-2 text-sm lg:text-lg rounded-2xl bg-blue-100 italic animate-pulse">
                AI is typing…
              </p>
          </div>
          )}

          <div ref={ messageEndRef } />
        </div>

        <div className='pb-4 pt-1'>
          <div className='flex justify-center gap-2'>
            <textarea  
              rows={2}
              value={inputText}
              placeholder='Type your message...'
              className={`px-3 py-2 w-2xl bg-white rounded-2xl shadow focus:outline-none ${isAITyping ? 'opacity-50 cursor-not-allowed' : ''}`} 
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (isAITyping) return;
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              className={`px-6 py-2 bg-gray-800 text-white rounded-2xl ${isAITyping ? 'bg-gray-400 cursor-not-allowed' : ' hover:scale-105 '}`}
              disabled={isAITyping}
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
