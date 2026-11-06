export type Status = 'new' | 'in_progress' | 'review' | 'accepted' | 'rework';
export interface Task {
    id: string;
    title: string;
    description: string;
    project_id: string;
    assignee_id: string;
    author_id: string;
    status: Status;
    created_at: string;
    updated_at: string;
}
export interface History {
    id: string;
    task_id: string;
    actor_id: string;
    from_status: Status | null;
    to_status: Status;
    comment: string | null;
    created_at: string;
}
export const statuses: Record<Status, string> = { new: 'Новая', in_progress: 'В работе', review: 'На проверке', accepted: 'Принята', rework: 'На доработке' };
