import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Profile } from '@/entities/user';
import type { Task, Status } from '@/entities/task';
import { client } from '@/shared/api';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from '@/shared/ui';
import { availableActions } from '../model/available-actions';

interface Props {
  task: Task;
  user: Profile;
  onSaved: () => Promise<void>;
}

export function TaskActions({ task, user, onSaved }: Props) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState('');
  const [returning, setReturning] = useState(false);
  async function transition(status: Status) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { error } = await client().rpc('transition_task', {
        p_task_id: task.id,
        p_expected_status: task.status,
        p_to_status: status,
        p_comment: comment.trim() || null,
      });
      if (error) throw error;
      await onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {error && <ErrorBox>{error}</ErrorBox>}
      <div className="task-actions">
        {availableActions(task, user).map((action) => (
          <button
            key={action.status}
            className={action.status === 'rework' ? '' : 'primary'}
            disabled={busy}
            onClick={() =>
              action.status === 'rework' ? setReturning(true) : void transition(action.status)
            }
          >
            {action.status === 'accepted' && <Check size={17} />}
            {busy ? 'Сохраняем…' : action.label}
          </button>
        ))}
      </div>
      {returning && (
        <form
          className="rework-form"
          onSubmit={(e) => {
            e.preventDefault();
            void transition('rework');
          }}
        >
          <label>
            Что нужно исправить?
            <textarea
              autoFocus
              required
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите причину возврата и ожидаемый результат"
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="primary" disabled={busy || !comment.trim()}>
              Вернуть на доработку
            </button>
            <button type="button" disabled={busy} onClick={() => setReturning(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}
      {!availableActions(task, user).length && (
        <p className="muted">
          {task.status === 'accepted'
            ? 'Работа принята. Задача завершена.'
            : user.role === 'manager'
              ? 'Следующий шаг — за исполнителем.'
              : 'Задача ожидает проверки постановщиком.'}
        </p>
      )}
    </>
  );
}
