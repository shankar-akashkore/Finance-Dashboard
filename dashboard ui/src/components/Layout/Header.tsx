import { useAppContext } from '../../context/AppContext';
import { Bell, Search } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { state } = useAppContext();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getViewTitle = (): string => {
    switch (state.activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'transactions':
        return 'Transactions';
      case 'insights':
        return 'Insights';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="header" id="main-header">
      <div className="header__left">
        <h1 className="header__title">{getViewTitle()}</h1>
        <p className="header__greeting">{getGreeting()}, welcome back! 👋</p>
      </div>
      <div className="header__right">
        <div className="header__search">
          <Search size={16} />
          <input type="text" placeholder="Quick search..." className="header__search-input" />
        </div>
        <button className="header__notification" id="notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="header__notification-badge">3</span>
        </button>
        <div className="header__avatar" id="user-avatar">
          <span>SK</span>
        </div>
      </div>
    </header>
  );
}
