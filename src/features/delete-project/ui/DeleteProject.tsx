import { client } from '@/shared/api';
import { ConfirmDelete } from '@/shared/ui';

interface Props {
  id: string;
  onDeleted: () => Promise<void>;
}
export function DeleteProject({ id, onDeleted }: Props) {
  async function remove() {
    const { error } = await client().rpc('delete_project', { p_project_id: id });
    if (error) throw error;
    await onDeleted();
  }

  return (
    <ConfirmDelete
      label="Удалить объект"
      description="Объект и все его задачи исчезнут из списков. История останется в базе."
      remove={remove}
    />
  );
}
