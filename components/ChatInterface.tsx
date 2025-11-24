import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, AppState } from '../types';
import { sendChatMessage } from '../services/gemini';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  appState: AppState;
  onScriptUpload: (script: string) => void;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, appState, onScriptUpload, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Auto focus on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history for API
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "ERROR: CONNECTION INTERRUPTED.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === 'Escape') {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-4 border-green-900 font-['VT323'] text-green-500 text-xl shadow-[0_0_20px_rgba(74,222,128,0.2)]">
      {/* Header */}
      <div className="p-2 border-b-2 border-green-800 bg-green-950/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
          <h2 className="tracking-widest">A.I. TERMINAL V3.0</h2>
        </div>
        <div className="text-sm opacity-70">[ESC] TO EXIT</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-black">
        {messages.length === 0 && (
          <div className="text-center opacity-50 mt-10">
            <p>INITIALIZING NEURAL NET...</p>
            <p>READY FOR INPUT.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] px-3 py-1 ${
                msg.role === 'user'
                  ? 'border border-green-600 text-green-400'
                  : 'text-green-500'
              } ${msg.isError ? 'text-red-500 border-red-500' : ''}`}
            >
              <span className="font-bold mr-2">{msg.role === 'user' ? '>' : '#'}</span>
              <span className="whitespace-pre-wrap leading-tight">{msg.text}</span>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="text-green-500 px-3 animate-pulse">
               PROCESSING...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t-2 border-green-800 bg-black">
        <div className="flex items-center gap-2">
          <span className="text-green-500 animate-pulse">{'>'}</span>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ENTER COMMAND..."
            className="flex-1 bg-transparent border-none text-green-400 placeholder-green-800 focus:ring-0 resize-none h-10 py-2 leading-tight uppercase caret-green-500"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;