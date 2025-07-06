import React from 'react';
import { Stethoscope, Menu, Home, Info, HelpCircle, Settings, X } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="bg-black/80 backdrop-blur-sm text-white p-3 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
          <Stethoscope size={24} className="text-white" />
          <h1 className="text-xl font-bold text-white">CareView</h1>
        </div>
        <nav className="hidden md:flex gap-4">
          <a href="#home" className="hover:text-gray-300 text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-gray-300 text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-gray-300 text-white transition-colors">Contact</a>
        </nav>
      </div>
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 w-64 h-screen bg-black/90 backdrop-blur-sm text-white shadow-lg z-10">
          <div className="p-4 pt-16 h-full">
            <h2 className="text-lg font-semibold mb-4 text-white">Menu</h2>
            <nav className="flex flex-col gap-2">
              <a href="#home" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors text-white">
                <Home size={20} />
                <span>Home</span>
              </a>
              <a href="#about" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors text-white">
                <Info size={20} />
                <span>About</span>
              </a>
              <a href="#help" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors text-white">
                <HelpCircle size={20} />
                <span>Help</span>
              </a>
              <a href="#settings" className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors text-white">
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </aside>
      )}
    </header>
  );
};

export default Header;