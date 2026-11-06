import { client } from '@/shared/api';
import type { History } from '../model/types';

export async function loadHistory(id: string): Promise<History[]> {
  const result: History[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client()
      .from('task_history')
      .select('*')
      .eq('task_id', id)
      .order('created_at')
      .order('id')
      .range(offset, offset + 499);
    if (error) throw error;
    result.push(...(data as History[]));
    if (data.length < 500) return result;
  }
}
