import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProjectRow } from './ProjectRow';
import type { Project } from '@/entities/project';
import type { Task } from '@/entities/task';
import { go } from '@/shared/lib';
import { Empty, SearchField } from '@/shared/ui';

interface Props {
  projects: Project[];
  tasks: Task[];
  manager: boolean;
}

export function ProjectsPage({ projects, tasks, manager }: Props) {
  const [query, setQuery] = useState('');
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Объекты</h1>
          <p>Все стройки и задачи по ним.</p>
        </div>
        {manager && (
          <button className="primary" onClick={() => go('/project-new')}>
            <Plus size={18} />
            Новый объект
          </button>
        )}
      </div>
      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Найти объект или адрес" />
      </div>
      <div className="project-list">
        {projects
          .filter((p) => `${p.name} ${p.address}`.toLowerCase().includes(query.toLowerCase()))
          .map((p) => {
            const list = tasks.filter((t) => t.project_id === p.id);
            return <ProjectRow key={p.id} project={p} tasks={list} />;
          })}
      </div>
      {!projects.filter((p) => `${p.name} ${p.address}`.toLowerCase().includes(query.toLowerCase()))
        .length && (
        <Empty title={projects.length ? 'Ничего не найдено' : 'Объектов пока нет'}>
          {manager
            ? 'Создайте объект, чтобы добавить первые задачи.'
            : 'Здесь появятся объекты с вашими задачами.'}
        </Empty>
      )}
      <p className="list-foot">
        {manager
          ? 'Откройте объект, чтобы посмотреть задачи и назначить работу.'
          : 'Вам доступны только объекты, на которых есть ваши задачи.'}
      </p>
    </>
  );
}
