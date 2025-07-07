import React, { useState } from 'react';
import Header from './components/Header';
import Checker from './components/Checker';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <div className={`min-h-[100dvh] bg-background text-foreground font-sans flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Checker />
        </main>
      </div>
    </div>
  );
}

export default App;