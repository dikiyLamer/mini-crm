import { ArrowRight } from 'lucide-react';
import { StatusBadge, type Task } from '@/entities/task';

interface Props {
  task: Task;
  projectName?: string;
  assigneeName: string;
}

export function TaskRow({ task: t, projectName, assigneeName }: Props) {
  return (
    <a className="task-row" href={`#/task/${t.id}`}>
      <div>
        <strong>{t.title}</strong>
        <small>{projectName}</small>
      </div>
      <span className="assignee">
        <span className="avatar">
          {assigneeName
            .split(' ')
            .map((x) => x[0])
            .slice(0, 2)
            .join('')}
        </span>
        {assigneeName}
      </span>
      <StatusBadge status={t.status} />
      <ArrowRight className="row-arrow" size={17} />
    </a>
  );
}
