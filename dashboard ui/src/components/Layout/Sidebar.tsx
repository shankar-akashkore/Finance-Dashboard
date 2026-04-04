import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  ShieldCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const { state, dispatch } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as const, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights' as const, label: 'Insights', icon: Lightbulb },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <Wallet size={22} />
          </div>
          {!collapsed && <span className="sidebar__logo-text">FinVault</span>}
        </div>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar__nav-item ${state.activeView === item.id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: item.id })}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
            {state.activeView === item.id && <div className="sidebar__nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        {/* Role Toggle */}
        <div className="sidebar__role-toggle" title={collapsed ? `Role: ${state.role}` : undefined}>
          <div className="sidebar__role-icon">
            {state.role === 'admin' ? <ShieldCheck size={18} /> : <Eye size={18} />}
          </div>
          {!collapsed && (
            <div className="sidebar__role-content">
              <span className="sidebar__role-label">Role</span>
              <select
                id="role-selector"
                className="sidebar__role-select"
                value={state.role}
                onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value as 'admin' | 'viewer' })}
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          className="sidebar__theme-btn"
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
          title={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  );
}
