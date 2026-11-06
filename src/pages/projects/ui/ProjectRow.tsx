import { ArrowRight, Building2, MapPin } from 'lucide-react';
import type { Project } from '@/entities/project';
import type { Task } from '@/entities/task';

interface Props {
  project: Project;
  tasks: Task[];
}
export function ProjectRow({ project: p, tasks: list }: Props) {
  return (
    <a className="project-row" href={`#/project/${p.id}`}>
      <div className="project-icon">
        <Building2 size={24} />
      </div>
      <div className="project-title">
        <h2>{p.name}</h2>
        <p>
          <MapPin size={14} />
          {p.address}
        </p>
      </div>
      <div className="project-count">
        <strong>{list.length}</strong>
        <span>задач</span>
      </div>
      <div className="project-summary">
        {list.some((t) => t.status === 'review') ? (
          <span className="review-text">
            {list.filter((t) => t.status === 'review').length} на проверке
          </span>
        ) : (
          <span>{list.filter((t) => t.status === 'accepted').length} принято</span>
        )}
      </div>
      <ArrowRight size={19} />
    </a>
  );
}
