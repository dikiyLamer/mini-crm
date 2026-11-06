import { statuses, type Status } from '../model/types';

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status}`}>
      <span />
      {statuses[status]}
    </span>
  );
}
