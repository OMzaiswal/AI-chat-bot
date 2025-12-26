import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  
  const [messages, setMessages] = useState<{
    id: string,
    text: string, 
    sender: 'AI' | 'User',
    createdAt: string
  }[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [inputText, setInputText] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const existingSessionId = localStorage.getItem('chat_session_id')
    if (existingSessionId) {
      setSessionId(existingSessionId)

      const fetchHistory = async () => {
        const response = await axios.post(`${apiUrl}/chat/history`, {
          sessionId
        })
        if (response.data.success) {
          setMessages(response.data.data);
          setNextCursor(response.data.nextCursor);
        }
      }
      fetchHistory();
    } 
  }, [])

  const handleSend = async () => {
    const res = await axios.post(`${apiUrl}/chat/message`, {
      message: inputText,
      sessionId
    })
  }

  return (
    <div className='flex flex-col h-screen gap-2 py-8 justify-center items-center'>
      <h1 className='text-2xl font-semibold'>Customer Support Chat</h1>
      <div className='bg-gray-300 h-full w-full max-w-4xl rounded-2xl shadow-lg relative'>

        <div className=''>
          hiiiiiiiiiiiiii
        </div>

        <div className='absolute inset-x-0 bottom-0 space-x-2 pb-8'>
          <div className='flex justify-center gap-2'>
            <textarea  
              rows={2}
              placeholder='Type your message...'
              className='px-3 py-2 w-2xl bg-white rounded-2xl' 
              onChange={(e) => setInputText(e.target.value)}
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
