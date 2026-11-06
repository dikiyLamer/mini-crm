import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { errorMessage } from '@/shared/lib';
import { ErrorBox } from './ErrorBox';

export function ConfirmDelete({
  label,
  description,
  remove,
}: {
  label: string;
  description: string;
  remove: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  
  return (
    <div className="delete-zone">
      {!open ? (
        <button className="text-button danger" onClick={() => setOpen(true)}>
          <Trash2 size={16} />
          {label}
        </button>
      ) : (
        <>
          <p>{description}</p>
          {error && <ErrorBox>{error}</ErrorBox>}
          <div className="form-actions">
            <button
              className="danger"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  await remove();
                } catch (e) {
                  setError(errorMessage(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? 'Удаляем…' : 'Подтвердить удаление'}
            </button>
            <button disabled={busy} onClick={() => setOpen(false)}>
              Отмена
            </button>
          </div>
        </>
      )}
    </div>
  );
}
