import { client } from '@/shared/api';
import { ConfirmDelete } from '@/shared/ui';
interface Props {
  id: string;
  onDeleted: () => Promise<void>;
}
export function DeleteTask({ id, onDeleted }: Props) {
  async function remove() {
    const { error } = await client().rpc('delete_task', { p_task_id: id });
    if (error) throw error;
    await onDeleted();
  }
  
  return (
    <ConfirmDelete
      label="Удалить задачу"
      description="Задача исчезнет из списков. История останется в базе."
      remove={remove}
    />
  );
}
