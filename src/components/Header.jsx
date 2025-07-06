import React from 'react';
import { Stethoscope, Menu, Home, Info, HelpCircle, Settings, X } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="bg-primary text-primary-foreground p-3 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-primary/90 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
          <Stethoscope size={24} className="text-white" />
          <h1 className="text-xl font-bold text-white">CareView</h1>
        </div>
        <nav className="hidden md:flex gap-4">
          <a href="#home" className="hover:text-accent-foreground text-white">Home</a>
          <a href="#about" className="hover:text-accent-foreground text-white">About</a>
          <a href="#contact" className="hover:text-accent-foreground text-white">Contact</a>
        </nav>
      </div>
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 w-64 h-full bg-sidebar-background text-sidebar-foreground shadow-md z-10">
          <div className="p-4 pt-16">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <nav className="flex flex-col gap-2">
              <a href="#home" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
                <Home size={20} />
                <span>Home</span>
              </a>
              <a href="#about" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
                <Info size={20} />
                <span>About</span>
              </a>
              <a href="#help" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
                <HelpCircle size={20} />
                <span>Help</span>
              </a>
              <a href="#settings" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
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