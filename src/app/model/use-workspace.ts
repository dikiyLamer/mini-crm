import { useCallback, useEffect, useState } from 'react';
import { loadProjects, type Project } from '@/entities/project';
import { loadTasks, type Task } from '@/entities/task';
import { loadProfiles, type Profile } from '@/entities/user';
import { errorMessage } from '@/shared/lib';

export function useWorkspace() {
  const [data, setData] = useState<{
    projects: Project[];
    tasks: Task[];
    profiles: Profile[];
  }>({ projects: [], tasks: [], profiles: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projects, tasks, profiles] = await Promise.all([
        loadProjects(),
        loadTasks(),
        loadProfiles(),
      ]);
      setData({ projects, tasks, profiles });
    } catch (e) {
      setError(errorMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

  return { data, loading, error, setError, refresh };
}
