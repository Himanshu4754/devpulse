import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 rounded-xl w-full max-w-sm space-y-4 border border-white/10"
      >
        <h1 className="font-display text-2xl font-semibold text-bone">
          Create your DevPulse account
        </h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface text-bone border border-white/10 focus:outline-none focus:border-pulse"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface text-bone border border-white/10 focus:outline-none focus:border-pulse"
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface text-bone border border-white/10 focus:outline-none focus:border-pulse"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-pulse hover:bg-pulse/90 text-ink font-medium disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-pulse">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;