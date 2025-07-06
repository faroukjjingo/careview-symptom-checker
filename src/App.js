import React from 'react';
import Checker from './components/Checker';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">
          <Checker />
        </main>
      </div>
    </div>
  );
}

export default App;