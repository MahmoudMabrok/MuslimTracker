import { useState } from 'react';
import { Link } from 'wouter';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <span className="material-icons mr-2">track_changes</span>
          <Link href="/" className="hover:opacity-80">
            Muslim Actions Tracker
          </Link>
        </h1>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Toggle theme"
        >
          <span className="material-icons">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
