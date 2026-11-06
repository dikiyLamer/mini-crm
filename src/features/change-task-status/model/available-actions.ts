import type { Profile } from '@/entities/user';
import type { Task, Status } from '@/entities/task';

export function availableActions(
  task: Task,
  user: Profile,
): {
  status: Status;
  label: string;
}[] {
  if (user.role === 'manager')
    return task.status === 'review'
      ? [
          { status: 'accepted', label: 'Принять задачу' },
          { status: 'rework', label: 'На доработку' },
        ]
      : [];
  if (task.assignee_id !== user.id) return [];
  if (task.status === 'new' || task.status === 'rework')
    return [{ status: 'in_progress', label: 'Взять в работу' }];
  return task.status === 'in_progress'
    ? [{ status: 'review', label: 'Отправить на проверку' }]
    : [];
}
