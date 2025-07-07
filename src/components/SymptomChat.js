// src/components/SymptomChat.jsx
import React from 'react';
import { Bot } from 'lucide-react';

const SymptomChat = ({ messages, chatEndRef, error }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-background border border-border rounded-lg">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
          <div
            className={`flex items-start gap-2 max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            } ${msg.isTyping ? 'italic opacity-70' : ''}`}
          >
            {msg.role === 'bot' && <Bot size={16} className="mt-1" />}
            <span className="text-base">{msg.content}</span>
          </div>
        </div>
      ))}
      {error && <p className="text-destructive text-center text-base mt-2">{error}</p>}
      <div ref={chatEndRef} />
    </div>
  );
};

export default SymptomChat;