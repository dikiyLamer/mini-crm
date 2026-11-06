import { statuses, type History } from '@/entities/task';
import { formatDate as date } from '@/shared/lib';

interface Props {
  entry: History;
  actorName: string;
}

export function HistoryItem({ entry: h, actorName }: Props) {
  return (
    <li>
      <span className={`history-dot ${h.to_status}`} />
      <div>
        <strong>
          {h.from_status
            ? `${statuses[h.from_status]} → ${statuses[h.to_status]}`
            : 'Задача создана'}
        </strong>
        <p>{actorName}</p>
        <time dateTime={h.created_at}>{date(h.created_at)}</time>
        {h.comment && <blockquote>{h.comment}</blockquote>}
      </div>
    </li>
  );
}
