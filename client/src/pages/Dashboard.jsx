import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ConnectRepoForm from '../components/ConnectRepoForm';
import RepositoryList from '../components/RepositoryList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // If the user is not logged in, redirect to the login page

  return (
    <div className="min-h-screen bg-ink text-bone p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-2xl">DevPulse</h1>
          <p className="text-muted text-sm">Welcome, {user?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/compare"
            className="px-4 py-2 rounded-lg bg-surface border border-white/10 hover:border-pulse/40 text-sm"
          >
            Compare repos
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-surface border border-white/10 hover:border-pulse/40 text-sm"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl mb-8">
        <ConnectRepoForm />
      </div>

      <h2 className="font-display text-lg mb-3">Your repositories</h2>
      <RepositoryList />
    </div>
  );
};

export default Dashboard;