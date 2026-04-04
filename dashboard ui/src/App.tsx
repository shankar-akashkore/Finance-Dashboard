import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Insights from './components/Insights/Insights';
import './App.css';

function AppContent() {
  const { state } = useAppContext();

  const renderView = () => {
    switch (state.activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        <Header />
        <main className="app__content" id="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
