import IssTracker from '../components/IssTracker';
import NewsDashboard from '../components/NewsDashboard';

export default function Dashboard() {
  return (
    <div className="pb-24">
      <IssTracker />
      <div className="border-t">
        <NewsDashboard />
      </div>
    </div>
  );
}
