// src/components/Header.jsx
import React from 'react';
import { Stethoscope, Menu, Home, Info, HelpCircle, Settings, X, Sun, Moon } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen, toggleDarkMode, isDarkMode }) => {
  return (
    <>
      <header className="bg-black/80 dark:bg-white/80 backdrop-blur-sm text-white dark:text-black p-3 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-all"
            >
              {isSidebarOpen ? <X size={24} className="text-white dark:text-black" /> : <Menu size={24} className="text-white dark:text-black" />}
            </button>
            <Stethoscope size={24} className="text-white dark:text-black" />
            <h1 className="text-xl font-bold text-white dark:text-black">CareView</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-all"
            >
              {isDarkMode ? <Sun size={24} className="text-white dark:text-black" /> : <Moon size={24} className="text-white dark:text-black" />}
            </button>
            <nav className="hidden md:flex gap-4">
              <a href="#home" className="hover:text-gray-300 dark:hover:text-gray-600 text-white dark:text-black transition-colors">Home</a>
              <a href="#about" className="hover:text-gray-300 dark:hover:text-gray-600 text-white dark:text-black transition-colors">About</a>
              <a href="#contact" className="hover:text-gray-300 dark:hover:text-gray-600 text-white dark:text-black transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-white/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-[100dvh] bg-black/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-black shadow-lg z-40">
            <div className="p-4 pt-16 h-full">
              <h2 className="text-lg font-semibold mb-4 text-white dark:text-black">Menu</h2>
              <nav className="flex flex-col gap-2">
                <a href="#home" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 dark:hover:bg-black/10 transition-colors text-white dark:text-black">
                  <Home size={20} />
                  <span>Home</span>
                </a>
                <a href="#about" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 dark:hover:bg-black/10 transition-colors text-white dark:text-black">
                  <Info size={20} />
                  <span>About</span>
                </a>
                <a href="#help" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 dark:hover:bg-black/10 transition-colors text-white dark:text-black">
                  <HelpCircle size={20} />
                  <span>Help</span>
                </a>
                <a href="#settings" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 dark:hover:bg-black/10 transition-colors text-white dark:text-black">
                  <Settings size={20} />
                  <span>Settings</span>
                </a>
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;