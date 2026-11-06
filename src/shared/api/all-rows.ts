import { client } from './client';
// Paginate instead of silently truncating the board at the PostgREST row limit.
export async function allRows<T>(table: string, order: string): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client()
      .from(table)
      .select('*')
      .order(order)
      .order('id')
      .range(offset, offset + 499);
    if (error) throw error;
    rows.push(...(data as T[]));
    if (data.length < 500) return rows;
  }
}
