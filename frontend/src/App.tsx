import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {

  interface Message {
    id: string;
    text: string;
    sender: string;
    conversationId?: string;
    createdAt: string;
    status?: 'sending' | 'sent' | 'erroe';
  }
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [inputText, setInputText] = useState('');
  // const [ aiReply, setAiReply] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const existingSessionId = localStorage.getItem('chat_session_id')
    if (existingSessionId) {
      setSessionId(existingSessionId)

      const fetchHistory = async () => {
        try {
          const response = await axios.post(`${apiUrl}/chat/history`, {
            sessionId
          })
          if (response.data.success) {
            setMessages(response.data.data);
            setNextCursor(response.data.nextCursor);
          }
        } catch(err) {
          console.log('Error: ',err);
          throw err;
        }
      }
      fetchHistory();
    } 
  }, [])

  const handleSend = async () => {
    if(!inputText.trim()) return;
    const tmpUsrMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'User',
      createdAt: new Date().toISOString(),
      status: 'sending'
    }
    setMessages(prev => [...prev, tmpUsrMsg]);
    const msgToSend = inputText;
    setInputText('');
    try {
      const res = await axios.post(`${apiUrl}/chat/message`, {
        message: msgToSend,
        sessionId: sessionId || undefined
      })
      if (res.data.reply) {
        const aiReply = res.data.reply;
        setMessages(prev => [...prev, aiReply])
      };
      if (!sessionId && res.data.sessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem('chat_session_id', res.data.sessionId)
      };

    } catch (err) {
      console.log('Error: ',err);
      throw err;
    }
  }

  const loadMoreMsg = async () => {
    if (!nextCursor) return;

    try {
      const res = await axios.post(`${apiUrl}/chat/history`, {
        sessionId,
        nextCursor
      })
      if (res.data.success) {
        setMessages(prev => [res.data.data, ...prev]);
        setNextCursor(res.data.nextCursor);
      }
    } catch (err) {
      console.log('Error: ',err);
      throw err;
    }
  }

  return (
    <div className='flex flex-col h-screen gap-2 py-8 justify-center items-center'>
      <h1 className='text-2xl font-semibold'>Customer Support Chat</h1>
      <div className='bg-gray-300 h-full w-full max-w-4xl rounded-2xl shadow-lg relative'>

        <div className='flex flex-col flex-1 overflow-y-auto gap-2 px-2 py-4'>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <p
              className={`px-4 py-2 text-sm lg:text-lg rounded-2xl shadow max-w-[70%] text-start ${msg.sender === 'User' ? 'bg-blue-200' :  'bg-blue-100'}`}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <div className='absolute inset-x-0 bottom-0 space-x-2 pb-8'>
          <div className='flex justify-center gap-2'>
            <textarea  
              rows={2}
              value={inputText}
              placeholder='Type your message...'
              className='px-3 py-2 w-2xl bg-white rounded-2xl' 
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            <button 
              className='px-6 py-2 bg-gray-800 text-white rounded-2xl hover:scale-105'
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
