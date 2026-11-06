import { allRows } from '@/shared/api';
import type { Project } from '../model/types';

export const loadProjects = () => allRows<Project>('projects', 'created_at');
