import React from 'react';
import { Stethoscope, Menu, Home, Info, HelpCircle, Settings } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-primary/90 rounded-lg transition-all"
          >
            <Menu size={24} />
          </button>
          <Stethoscope size={24} />
          <h1 className="text-2xl font-bold">CareView</h1>
        </div>
        <nav className="hidden md:flex gap-4">
          <a href="#home" className="hover:text-accent-foreground">Home</a>
          <a href="#about" className="hover:text-accent-foreground">About</a>
          <a href="#contact" className="hover:text-accent-foreground">Contact</a>
        </nav>
      </div>
      {isSidebarOpen && (
        <aside className="absolute top-full left-0 w-64 bg-card text-card-foreground shadow-md z-10">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <nav className="flex flex-col gap-2">
              <a href="#home" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                <Home size={20} />
                <span>Home</span>
              </a>
              <a href="#about" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                <Info size={20} />
                <span>About</span>
              </a>
              <a href="#help" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                <HelpCircle size={20} />
                <span>Help</span>
              </a>
              <a href="#settings" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
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