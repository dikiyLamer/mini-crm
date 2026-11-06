import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { client } from '@/shared/api';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from '@/shared/ui';
import type { Project } from '@/entities/project';
import type { Profile } from '@/entities/user';
import type { Task } from '@/entities/task';

export function TaskForm({
  task,
  projectId,
  projects,
  profiles,
  onSaved,
}: {
  task?: Task;
  projectId: string;
  projects: Project[];
  profiles: Profile[];
  onSaved: (path: string) => Promise<void>;
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const executors = profiles.filter((p) => p.role === 'executor');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const values = {
      title: String(f.get('title')).trim(),
      description: String(f.get('description')).trim(),
      project_id: String(f.get('project')),
      assignee_id: String(f.get('assignee')),
    };
    try {
      if (!values.title) throw new Error('Введите название задачи.');
      const result = task
        ? await client().from('tasks').update(values).eq('id', task.id).select('id').single()
        : await client().from('tasks').insert(values).select('id').single();
      if (result.error) throw result.error;
      await onSaved(`/task/${result.data.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const back = task ? `/task/${task.id}` : `/project/${projectId}`;
  return (
    <>
      <a className="back" href={`#${back}`}>
        <ArrowLeft size={16} />
        Назад
      </a>
      <div className="page-heading">
        <div>
          <h1>{task ? 'Редактировать задачу' : 'Новая задача'}</h1>
          <p>
            {task
              ? 'Изменение полей не меняет статус задачи.'
              : 'Новая задача сразу появится у назначенного исполнителя.'}
          </p>
        </div>
      </div>
      <form className="edit-form" onSubmit={submit}>
        {error && <ErrorBox>{error}</ErrorBox>}
        <label>
          Название
          <input name="title" required maxLength={200} defaultValue={task?.title} autoFocus />
        </label>
        <label>
          Описание <span className="optional">необязательно</span>
          <textarea
            name="description"
            rows={5}
            maxLength={10000}
            defaultValue={task?.description}
          />
        </label>
        <label>
          Объект
          <select name="project" required defaultValue={projectId}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Исполнитель
          <select name="assignee" required defaultValue={task?.assignee_id ?? ''}>
            <option value="" disabled>
              Выберите исполнителя
            </option>
            {executors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.display_name}
              </option>
            ))}
          </select>
        </label>
        {!executors.length && <ErrorBox>Сначала добавьте исполнителя в Supabase.</ErrorBox>}
        <div className="form-actions">
          <button className="primary" disabled={busy || !executors.length}>
            {busy ? 'Сохраняем…' : task ? 'Сохранить изменения' : 'Создать задачу'}
          </button>
          <a className="button" href={`#${back}`}>
            Отмена
          </a>
        </div>
      </form>
    </>
  );
}
