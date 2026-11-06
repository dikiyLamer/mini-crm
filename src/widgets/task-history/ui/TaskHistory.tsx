import { HistoryItem } from './HistoryItem';
import { useEffect, useState } from 'react';
import { loadHistory, type Task, type History } from '@/entities/task';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from '@/shared/ui';

interface Props {
  task: Task;
  person: (id: string) => string;
}

export function TaskHistory({ task, person }: Props) {
  const [history, setHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setHistoryLoading(true);
    setError('');
    loadHistory(task.id)
      .then((h) => {
        if (active) setHistory(h);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [task.id, retry]);
  return (
    <section className="history">
      <h2>История задачи</h2>
      <p className="muted">Все изменения статуса по порядку</p>
      {error && (
        <ErrorBox>
          {error} <button onClick={() => setRetry((v) => v + 1)}>Повторить загрузку истории</button>
        </ErrorBox>
      )}
      {historyLoading ? (
        <p role="status">Загружаем историю…</p>
      ) : (
        <ol>
          {history.map((h) => (
            <HistoryItem key={h.id} entry={h} actorName={person(h.actor_id)} />
          ))}
        </ol>
      )}
    </section>
  );
}
