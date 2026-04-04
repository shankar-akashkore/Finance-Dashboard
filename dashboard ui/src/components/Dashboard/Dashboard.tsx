import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard" id="dashboard-view">
      <SummaryCards />
      <div className="dashboard__charts">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <div className="dashboard__bottom">
        <RecentTransactions />
      </div>
    </div>
  );
}
