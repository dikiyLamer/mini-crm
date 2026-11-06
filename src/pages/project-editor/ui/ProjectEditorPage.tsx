import type { ComponentProps } from 'react';
import { ProjectForm } from '@/features/edit-project';

export function ProjectEditorPage(props: ComponentProps<typeof ProjectForm>) {
  return <ProjectForm {...props} />;
}
