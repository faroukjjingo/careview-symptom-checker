
import React, { useState } from 'react';
import Checker from './components/Checker';
import Header from './components/Header';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">
          <Checker />
        </main>
      </div>
    </div>
  );
}

export default App;