import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { client } from '@/shared/api';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from '@/shared/ui';
import type { Project } from '@/entities/project';

export function ProjectForm({
  project,
  onSaved,
}: {
  project?: Project;
  onSaved: (path: string) => Promise<void>;
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const values = { name: String(f.get('name')).trim(), address: String(f.get('address')).trim() };
    try {
      if (!values.name || !values.address) throw new Error('Заполните название и адрес.');
      const result = project
        ? await client().from('projects').update(values).eq('id', project.id).select('id').single()
        : await client().from('projects').insert(values).select('id').single();
      if (result.error) throw result.error;
      await onSaved(`/project/${result.data.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const back = project ? `/project/${project.id}` : '/projects';
  return (
    <>
      <a className="back" href={`#${back}`}>
        <ArrowLeft size={16} />
        Назад
      </a>
      <div className="page-heading">
        <div>
          <h1>{project ? 'Редактировать объект' : 'Новый объект'}</h1>
          <p>Укажите название стройки и её адрес.</p>
        </div>
      </div>
      <form className="edit-form" onSubmit={submit}>
        {error && <ErrorBox>{error}</ErrorBox>}
        <label>
          Название
          <input
            name="name"
            required
            maxLength={200}
            defaultValue={project?.name}
            autoFocus
            placeholder="Например, ЖК «Сосновый квартал»"
          />
        </label>
        <label>
          Адрес
          <input
            name="address"
            required
            maxLength={500}
            defaultValue={project?.address}
            placeholder="Улица, дом, корпус"
          />
        </label>
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            {busy ? 'Сохраняем…' : project ? 'Сохранить изменения' : 'Создать объект'}
          </button>
          <a className="button" href={`#${back}`}>
            Отмена
          </a>
        </div>
      </form>
    </>
  );
}
