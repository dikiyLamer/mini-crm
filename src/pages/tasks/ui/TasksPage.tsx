import { RefreshCw } from 'lucide-react';
import type { Project } from '@/entities/project';
import type { Task } from '@/entities/task';
import { TaskList } from '@/widgets/task-list';

interface Props {
  tasks: Task[];
  projects: Project[];
  manager: boolean;
  person: (id: string) => string;
  refresh: () => Promise<void>;
}

export function TasksPage({ tasks, projects, manager, person, refresh }: Props) {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{manager ? 'Все задачи' : 'Мои задачи'}</h1>
          <p>
            {manager
              ? 'Назначения, ход работ и задачи на приёмку.'
              : 'Ваши назначения и текущий статус работы.'}
          </p>
        </div>
        <button onClick={() => void refresh().catch(() => {})}>
          <RefreshCw size={17} />
          Обновить
        </button>
      </div>
      <TaskList list={tasks} projects={projects} person={person} manager={manager} />
    </>
  );
}
