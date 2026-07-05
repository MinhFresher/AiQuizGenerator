import React from 'react';
import { Brain, Layers, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogoClick: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  onLogoClick,
  darkMode,
  toggleTheme,
}) => {
  return (
    <header className="border-b border-stone-200 bg-[var(--bg-header)]/95 px-6 py-4 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
      <div 
        onClick={onLogoClick}
        className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
        title="Return to home generator screen"
      >
        <div className="p-2.5 bg-stone-900 rounded-xl text-white shadow-sm flex items-center justify-center">
          <Brain className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2">
            PrepAI Studio
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold tracking-widest">v2.5</span>
          </h1>
          <p className="text-[10px] text-stone-500 font-mono">SECURE ACADEMIC DOCUMENT REASONING & QUIZ ENGINE</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg border border-stone-200 transition-all flex items-center justify-center cursor-pointer shadow-xs"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-stone-500" />
          )}
        </button>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-stone-700 hover:bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Layers className="w-4 h-4 text-stone-500" />
          <span>{isSidebarOpen ? 'Hide Library' : 'Show Library'}</span>
        </button>
      </div>
    </header>
  );
};
export default Header;
