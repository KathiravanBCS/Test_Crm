import { ListPageLayout } from '@/components/list-page';
import { TaskView } from '../components/TaskView';

export function TaskPage() {
  return (
    <ListPageLayout title="Tasks">
      <TaskView />
    </ListPageLayout>
  );
}