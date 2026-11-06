import { allRows } from '@/shared/api';
import type { Task } from '../model/types';

export const loadTasks = () => allRows<Task>('tasks', 'created_at');
