import { useState, useEffect } from 'react';

const useTypingEffect = (setMessages) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  const startTyping = (text) => {
    setTypingText(text);
    setTypingIndex(0);
    setMessages((prev) => [...prev, { role: 'bot', content: '', isTyping: true }]);
    setIsTyping(true);
  };

  const cancelTyping = () => {
    setIsTyping(false);
    setTypingText('');
    setTypingIndex(0);
  };

  useEffect(() => {
    if (isTyping && typingText && typingIndex < typingText.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = typingText.slice(0, typingIndex + 1);
          return updated;
        });
        setTypingIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else if (isTyping && typingIndex >= typingText.length) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].isTyping = false;
        return updated;
      });
      setIsTyping(false);
      setTypingText('');
      setTypingIndex(0);
    }
  }, [isTyping, typingIndex, typingText, setMessages]);

  return { startTyping, cancelTyping };
};

export default useTypingEffect;