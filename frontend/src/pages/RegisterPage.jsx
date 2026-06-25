import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, AtSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AmbientBackground from '../components/AmbientBackground';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = { ...form };
    if (!payload.phone) delete payload.phone;

    const result = await register(payload);
    if (result.success) {
      navigate('/dashboard');
    } else if (result.fieldErrors) {
      const flattened = {};
      Object.entries(result.fieldErrors).forEach(([key, messages]) => {
        flattened[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      setFieldErrors(flattened);
    }
  };

  const fields = [
    { key: 'name', label: 'Nama Lengkap', type: 'text', icon: User, placeholder: 'Nama lengkap' },
    { key: 'username', label: 'Username', type: 'text', icon: AtSign, placeholder: 'Username' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'Email' },
    { key: 'phone', label: 'Nomor HP (opsional)', type: 'text', icon: Phone, placeholder: '0812xxxxxxx' },
    { key: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'Minimal 8 karakter' },
    { key: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', icon: Lock, placeholder: 'Ulangi password' },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 font-body">
      <AmbientBackground />

      <form onSubmit={handleSubmit} className="panel w-full max-w-sm rounded-xl2 p-8 sm:p-9">
        <div className="mb-7">
          <h1 className="font-serif text-2xl font-medium text-ink-primary">Buat Akun</h1>
          <p className="mt-1 text-xs text-ink-muted">Daftar Mini Wallet</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
          <div key={key} className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-ink-muted" htmlFor={key}>
              {label}
            </label>
            <div className="relative">
              <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                id={key}
                type={type}
                className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
                placeholder={placeholder}
                value={form[key]}
                onChange={handleChange(key)}
                required={key !== 'phone'}
                disabled={loading}
              />
            </div>
            {fieldErrors[key] && (
              <p className="mt-1 text-xs text-accent-danger">{fieldErrors[key]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-primary py-2.5 text-sm font-semibold text-base transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="mt-5 text-center text-xs text-ink-muted">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-accent-emerald hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}