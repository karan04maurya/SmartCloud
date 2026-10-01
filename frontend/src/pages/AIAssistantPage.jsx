import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import api from '../services/api';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your SmartCloud AI Assistant. How can I help you with your studies today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // API Call
    const fetchAIResponse = async () => {
      try {
        // Map existing messages to Gemini history format, skipping the first greeting
        const history = messages
          .filter(msg => msg.id !== 1) // Skip the hardcoded greeting which breaks Gemini history rules
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

        const res = await api.post('/ai/ask', { 
          prompt: input,
          history: history
        });
        
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: res.data.response }]);
      } catch (error) {
        console.error("AI Assistant Error:", error);
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Sorry, I am currently unavailable. Please check your connection." }]);
      } finally {
        setIsTyping(false);
      }
    };
    
    fetchAIResponse();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
          <FiCpu className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SmartCloud AI</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.sender === 'user' ? 'bg-slate-800 ml-3' : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mr-3'}`}>
                {msg.sender === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              <div className={`whitespace-pre-wrap px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mr-3">
                <FiCpu />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your studies..." 
            className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;
