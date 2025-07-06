import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={24} />
          <h1 className="text-2xl font-bold">CareView</h1>
        </div>
        <nav className="flex gap-4">
          <a href="#home" className="hover:text-accent-foreground">Home</a>
          <a href="#about" className="hover:text-accent-foreground">About</a>
          <a href="#contact" className="hover:text-accent-foreground">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;