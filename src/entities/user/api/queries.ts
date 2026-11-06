import { allRows } from '@/shared/api';
import type { Profile } from '../model/types';

export const loadProfiles = () => allRows<Profile>('profiles', 'display_name');
