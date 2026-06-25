import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AmbientBackground from '../components/AmbientBackground';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const success = await login(loginId, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 font-body">
      <AmbientBackground />

      <form onSubmit={handleSubmit} className="panel w-full max-w-sm rounded-xl2 p-8 sm:p-9">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-medium text-ink-primary">Mini Wallet</h1>
          <p className="mt-1 text-xs text-ink-muted">Masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-ink-muted" htmlFor="login">
          Email / Username
        </label>
        <div className="relative mb-4">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            id="login"
            className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
            type="text"
            placeholder="Email atau username"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <label className="mb-1.5 block text-xs font-medium text-ink-muted" htmlFor="password">
          Password
        </label>
        <div className="relative mb-7">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            id="password"
            className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-primary py-2.5 text-sm font-semibold text-base transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            'Memproses...'
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </button>

        <p className="mt-5 text-center text-xs text-ink-muted">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-accent-emerald hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}