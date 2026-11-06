import { Building2, ClipboardList, LogOut } from 'lucide-react';
import { roles, type Profile } from '@/entities/user';

interface Props {
  route: string[];
  user?: Profile;
  projectCount: number;
  taskCount: number;
  onLogout: () => Promise<void>;
}

export function Sidebar({ route, user, projectCount, taskCount, onLogout }: Props) {
  const manager = user?.role === 'manager';
  return (
    <aside className="sidebar">
      <a href="#/projects" className="brand">
        <Building2 size={25} />
        <span>
          Объекты
          <br />и задачи
        </span>
      </a>
      <div className="workspace-label">Рабочее пространство</div>
      <nav aria-label="Основная навигация">
        <a className={route[0]?.startsWith('project') ? 'active' : ''} href="#/projects">
          <Building2 size={19} />
          Объекты<span>{projectCount}</span>
        </a>
        <a
          className={['tasks', 'task', 'task-new', 'task-edit'].includes(route[0]) ? 'active' : ''}
          href="#/tasks"
        >
          <ClipboardList size={19} />
          {manager ? 'Все задачи' : 'Мои задачи'}
          <span>{taskCount}</span>
        </a>
      </nav>
      <div className="sidebar-bottom">
        <div className="user">
          <span className="avatar">{user?.display_name[0] ?? '?'}</span>
          <div>
            <strong>{user?.display_name ?? 'Загрузка…'}</strong>
            <small>{user ? roles[user.role] : 'Проверка доступа'}</small>
          </div>
        </div>
        <button className="text-button" onClick={() => void onLogout()}>
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
