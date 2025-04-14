import { useLocation, Link } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const getNavClass = (path: string) => {
    const baseClass = "flex-1 py-3 px-4 text-center font-medium flex flex-col items-center";
    const activePath = location.pathname === "/" ? "/tracker" : location.pathname;
    return `${baseClass} ${activePath === path ? 'bg-primary text-white' : 'text-neutral-dark hover:bg-gray-100'}`;
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
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
  );
}
