import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { client } from '@/shared/api';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from '@/shared/ui';

export function SignInForm({ initialError }: { initialError: string }) {
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(e.currentTarget);
    try {
      const { error } = await client().auth.signInWithPassword({
        email: String(data.get('email')).trim(),
        password: String(data.get('password')),
      });
      if (error) throw error;
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {error && <ErrorBox>{error}</ErrorBox>}
      <form onSubmit={submit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            placeholder="name@company.ru"
          />
        </label>
        <label>
          Пароль
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="primary wide" disabled={busy}>
          {busy ? 'Входим…' : 'Войти'}
          <ArrowRight size={18} />
        </button>
      </form>
    </>
  );
}
