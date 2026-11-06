import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { ProjectsPage } from '@/pages/projects';
import { TasksPage } from '@/pages/tasks';
import { ProjectPage } from '@/pages/project-detail';
import { TaskPage } from '@/pages/task-detail';
import { ProjectEditorPage } from '@/pages/project-editor';
import { TaskEditorPage } from '@/pages/task-editor';
import { WorkspaceLayout } from '@/widgets/workspace-layout';
import { Empty, ErrorBox } from '@/shared/ui';
import { errorMessage, go, useRoute } from '@/shared/lib';
import { useWorkspace } from '../model/use-workspace';

interface Props {
  userId: string;
  onLogout: () => void | Promise<void>;
}

export function WorkspaceRouter({ userId, onLogout }: Props) {
  const route = useRoute();
  const routeKey = route.join('/');
  const { data, loading, error, setError, refresh } = useWorkspace();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setNotice('');
  }, [routeKey]);

  const user = data.profiles.find((p) => p.id === userId);
  const tasks =
    user?.role === 'executor' ? data.tasks.filter((t) => t.assignee_id === user.id) : data.tasks;
  const projects =
    user?.role === 'executor'
      ? data.projects.filter((p) => tasks.some((t) => t.project_id === p.id))
      : data.projects;
  const manager = user?.role === 'manager';
  const project = projects.find((p) => p.id === route[1]);
  const task = tasks.find((t) => t.id === route[1]);
  const person = (id: string) =>
    data.profiles.find((p) => p.id === id)?.display_name ?? 'Пользователь';
  async function saved(path: string) {
    await refresh();
    go(path);
    setNotice('Изменения сохранены.');
  }
  async function logout() {
    try {
      await onLogout();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  function renderPage() {
    if (!user)
      return (
        <Empty title="Профиль не настроен">
          Попросите администратора добавить ваше имя и роль в таблицу profiles.
        </Empty>
      );
    switch (route[0]) {
      case 'projects':
        return <ProjectsPage projects={projects} tasks={tasks} manager={manager} />;
      case 'tasks':
        return (
          <TasksPage
            tasks={tasks}
            projects={projects}
            manager={manager}
            person={person}
            refresh={refresh}
          />
        );
      case 'project':
        return project ? (
          <ProjectPage
            key={project.id}
            project={project}
            projects={projects}
            tasks={tasks}
            manager={manager}
            person={person}
            saved={saved}
          />
        ) : (
          <Empty title="Объект недоступен">Он удалён или у вас нет доступа.</Empty>
        );
      case 'task':
        return task ? (
          <TaskPage
            key={task.id + task.updated_at}
            task={task}
            user={user}
            person={person}
            project={projects.find((p) => p.id === task.project_id)}
            onSaved={() => saved(`/task/${task.id}`)}
            onDeleted={() => saved(`/project/${task.project_id}`)}
          />
        ) : (
          <Empty title="Задача недоступна">Она удалена или назначена другому исполнителю.</Empty>
        );
      case 'project-new':
      case 'project-edit':
        return manager && (route[0] === 'project-new' || project) ? (
          <ProjectEditorPage key={routeKey} project={project} onSaved={saved} />
        ) : (
          <Empty title="Действие недоступно" />
        );
      case 'task-new':
      case 'task-edit':
        return manager && (route[0] === 'task-new' ? !!project : !!task) ? (
          <TaskEditorPage
            key={routeKey}
            task={task}
            projectId={project?.id ?? task?.project_id ?? ''}
            projects={projects}
            profiles={data.profiles}
            onSaved={saved}
          />
        ) : (
          <Empty title="Действие недоступно" />
        );
      default:
        return (
          <Empty title="Страница не найдена">
            <a href="#/projects">Перейти к объектам</a>
          </Empty>
        );
    }
  }
  return (
    <WorkspaceLayout
      route={route}
      user={user}
      projectCount={projects.length}
      taskCount={tasks.length}
      onLogout={logout}
    >
      {error && (
        <ErrorBox>
          {error} <button onClick={() => void refresh().catch(() => {})}>Повторить</button>
        </ErrorBox>
      )}
      {notice && (
        <div className="notice" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
      {loading ? (
        <div className="loading" role="status">
          Загружаем объекты и задачи…
        </div>
      ) : (
        renderPage()
      )}
    </WorkspaceLayout>
  );
}
