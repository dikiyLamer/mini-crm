import type { ReactNode } from 'react';
import { roles, type Profile } from '@/entities/user';
import { Sidebar } from './Sidebar';

interface Props {
  children: ReactNode;
  route: string[];
  user?: Profile;
  projectCount: number;
  taskCount: number;
  onLogout: () => Promise<void>;
}

export function WorkspaceLayout({
  children,
  route,
  user,
  projectCount,
  taskCount,
  onLogout,
}: Props) {
  return (
    <div className="app-shell">
      <Sidebar
        route={route}
        user={user}
        projectCount={projectCount}
        taskCount={taskCount}
        onLogout={onLogout}
      />
      <div className="workspace">
        <header className="topbar">
          <span>Строительные проекты</span>
          <span className="connection">
            <span />
            Рабочая среда
          </span>
        </header>

        <main id="main">
          <div className="mobile-user">
            {user?.display_name} · {user && roles[user.role]}
          </div>
          {children}
        </main>
        <footer>
          Объекты и задачи<span>Единый порядок работы команды</span>
        </footer>
      </div>
    </div>
  );
}
