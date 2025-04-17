
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex-1 py-3 px-4 text-center font-medium flex flex-col items-center";
    const activePath = location.pathname === "/" ? "/tracker" : location.pathname;
    return `${baseClass} ${activePath === path ? 'bg-primary text-white' : 'text-neutral-dark hover:bg-gray-100'}`;
  };

  return (
    <header>
      <div className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <span className="material-icons mr-2">track_changes</span>
            <Link to="/" className="hover:opacity-80">
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
      </div>
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          <nav className="flex border-b">
            <Link to="/tracker" className={getNavClass('/tracker')}>
              <span className="material-icons block mx-auto mb-1">add_task</span>
              Tracker
            </Link>
            <Link to="/statistics" className={getNavClass('/statistics')}>
              <span className="material-icons block mx-auto mb-1">bar_chart</span>
              Statistics
            </Link>
            <Link to="/achievements" className={getNavClass('/achievements')}>
              <span className="material-icons block mx-auto mb-1">emoji_events</span>
              Achievements
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
