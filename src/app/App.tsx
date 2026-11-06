import { useEffect, useState } from 'react';
import { client, supabase } from '@/shared/api';
import { errorMessage, go } from '@/shared/lib';
import { LoginPage } from '@/pages/login';
import { WorkspaceRouter } from './router/WorkspaceRouter';

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUserId(session?.user.id ?? null);
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (active) {
        if (error) setError(errorMessage(error));

        setUserId(data.session?.user.id ?? null);
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!ready)
    return (
      <div className="center" role="status">
        Проверяем сессию…
      </div>
    );

  if (userId)
    return (
      <WorkspaceRouter
        key={userId}
        userId={userId}
        onLogout={async () => {
          const { error } = await client().auth.signOut();
          if (error) throw error;
          go('/projects');
        }}
      />
    );

  return <LoginPage initialError={error} />;
}
