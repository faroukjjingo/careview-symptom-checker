import React from 'react';
import { Home, Info, HelpCircle, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-card text-card-foreground shadow-md">
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
  );
};

export default Sidebar;