import { ArrowLeft, MapPin, Plus, SquarePen } from 'lucide-react';
import type { Project } from '@/entities/project';
import type { Task } from '@/entities/task';
import { DeleteProject } from '@/features/delete-project';
import { TaskList } from '@/widgets/task-list';
import { go } from '@/shared/lib';

interface Props {
  project: Project;
  projects: Project[];
  tasks: Task[];
  manager: boolean;
  person: (id: string) => string;
  saved: (path: string) => Promise<void>;
}

export function ProjectPage({ project, projects, tasks, manager, person, saved }: Props) {
  return (
    <>
      <a className="back" href="#/projects">
        <ArrowLeft size={16} />
        Все объекты
      </a>
      <div className="page-heading">
        <div>
          <h1>{project.name}</h1>
          <p>
            <MapPin size={16} />
            {project.address}
          </p>
        </div>
        {manager && (
          <button onClick={() => go(`/project-edit/${project.id}`)}>
            <SquarePen size={17} />
            Редактировать
          </button>
        )}
      </div>
      <div className="section-heading">
        <h2>
          Задачи объекта <span>{tasks.filter((t) => t.project_id === project.id).length}</span>
        </h2>
        {manager && (
          <button className="primary" onClick={() => go(`/task-new/${project.id}`)}>
            <Plus size={18} />
            Новая задача
          </button>
        )}
      </div>
      <TaskList
        list={tasks.filter((t) => t.project_id === project.id)}
        projects={projects}
        person={person}
        manager={manager}
      />
      {manager && <DeleteProject id={project.id} onDeleted={() => saved('/projects')} />}
    </>
  );
}
