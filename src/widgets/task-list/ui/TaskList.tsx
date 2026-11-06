import { TaskRow } from './TaskRow';
import { useState } from 'react';
import type { Project } from '@/entities/project';
import { statuses, type Task, type Status } from '@/entities/task';
import { Empty, SearchField } from '@/shared/ui';

interface Props {
  list: Task[];
  projects: Project[];
  person: (id: string) => string;
  manager: boolean;
}

export function TaskList({ list, projects, person, manager }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status | ''>('');
  const toolbar = (
    <div className="toolbar">
      <SearchField value={query} onChange={setQuery} placeholder="Найти задачу" />
      <select
        aria-label="Фильтр по статусу"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Status | '')}
      >
        <option value="">Все статусы</option>
        {Object.entries(statuses).map(([s, name]) => (
          <option key={s} value={s}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
  const filteredTasks = (items: Task[]) =>
    items.filter(
      (t) =>
        (!filter || t.status === filter) &&
        `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase()),
    );
  const visible = filteredTasks(list);
  return (
    <>
      {toolbar}
      {visible.length ? (
        <div className="task-list">
          <div className="table-head">
            <span>Задача / объект</span>
            <span>Исполнитель</span>
            <span>Статус</span>
          </div>
          {visible.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              projectName={projects.find((p) => p.id === t.project_id)?.name}
              assigneeName={person(t.assignee_id)}
            />
          ))}
        </div>
      ) : (
        <Empty title={list.length ? 'Ничего не найдено' : 'Задач пока нет'}>
          {list.length
            ? 'Измените поисковый запрос или фильтр.'
            : manager
              ? 'Создайте задачу и назначьте исполнителя.'
              : 'Назначенные вам задачи появятся здесь.'}
        </Empty>
      )}
    </>
  );
}
