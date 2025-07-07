import React, { useContext } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';

const SymptomChat = () => {
  const { messages, errorMessage } = useContext(SymptomCheckerContext);

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            } ${message.isTyping ? 'italic' : ''}`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
    </div>
  );
};

export default SymptomChat;