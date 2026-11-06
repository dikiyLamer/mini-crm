import type { ComponentProps } from 'react';
import { TaskForm } from '@/features/edit-task';

export function TaskEditorPage(props: ComponentProps<typeof TaskForm>) {
  return <TaskForm {...props} />;
}
