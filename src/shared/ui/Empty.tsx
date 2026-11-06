import type { ReactNode } from 'react';
import { ClipboardList } from 'lucide-react';

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <ClipboardList size={28} />
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
