import { ArrowLeft, SquarePen } from 'lucide-react';
import type { Task } from '@/entities/task';
import { StatusBadge } from '@/entities/task';
import type { Profile } from '@/entities/user';
import type { Project } from '@/entities/project';
import { TaskActions } from '@/features/change-task-status';
import { DeleteTask } from '@/features/delete-task';
import { TaskHistory } from '@/widgets/task-history';
import { go, formatDate as date } from '@/shared/lib';

interface Props {
  task: Task;
  user: Profile;
  person: (id: string) => string;
  project?: Project;
  onSaved: () => Promise<void>;
  onDeleted: () => Promise<void>;
}

export function TaskPage({ task, user, person, project, onSaved, onDeleted }: Props) {
  return (
    <>
      <a className="back" href={`#/project/${task.project_id}`}>
        <ArrowLeft size={16} />
        {project?.name ?? 'К объекту'}
      </a>
      <div className="page-heading">
        <div>
          <StatusBadge status={task.status} />
          <h1 className="task-title">{task.title}</h1>
        </div>
        {user.role === 'manager' && (
          <button onClick={() => go(`/task-edit/${task.id}`)}>
            <SquarePen size={17} />
            Редактировать
          </button>
        )}
      </div>
      <div className="detail-grid">
        <section className="task-content">
          <h2>Описание задачи</h2>
          <p className="description">{task.description || 'Описание не добавлено.'}</p>
          <dl>
            <div>
              <dt>Исполнитель</dt>
              <dd>{person(task.assignee_id)}</dd>
            </div>
            <div>
              <dt>Постановщик</dt>
              <dd>{person(task.author_id)}</dd>
            </div>
            <div>
              <dt>Создана</dt>
              <dd>{date(task.created_at)}</dd>
            </div>
            <div>
              <dt>Объект</dt>
              <dd>
                <a href={`#/project/${task.project_id}`}>{project?.name}</a>
              </dd>
            </div>
          </dl>
          <TaskActions task={task} user={user} onSaved={onSaved} />
        </section>
        <TaskHistory task={task} person={person} />
      </div>
      {user.role === 'manager' && <DeleteTask id={task.id} onDeleted={onDeleted} />}
    </>
  );
}
