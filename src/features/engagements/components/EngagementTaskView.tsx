import { Modal } from '@mantine/core';
import { TaskView } from '@/features/tasks/components/TaskView';
import { useNavigate } from 'react-router-dom';
import type { Task } from '@/features/tasks/types';

interface EngagementTaskViewProps {
  engagementId: number;
  phaseId?: number;
  serviceItemId?: number;
  showInModal?: boolean;
}

export function EngagementTaskView({ 
  engagementId, 
  phaseId, 
  serviceItemId,
  showInModal = false 
}: EngagementTaskViewProps) {
  const navigate = useNavigate();
  
  const handleTaskCreate = (context?: { engagementId?: number; phaseId?: number; serviceItemId?: number }) => {
    // Custom task creation logic for engagement context
    const params = new URLSearchParams();
    if (context?.engagementId) params.append('engagement_id', context.engagementId.toString());
    if (context?.phaseId) params.append('phase_id', context.phaseId.toString());
    if (context?.serviceItemId) params.append('service_item_id', context.serviceItemId.toString());
    
    navigate(`/tasks/new?${params.toString()}`);
  };
  
  const handleTaskEdit = (task: Task) => {
    // Custom task editing logic for engagement context
    navigate(`/tasks/${task.id}/edit?from=engagement&engagement_id=${engagementId}`);
  };
  
  const taskView = (
    <TaskView
      engagementId={engagementId}
      phaseId={phaseId}
      serviceItemId={serviceItemId}
      title={phaseId ? 'Phase Tasks' : serviceItemId ? 'Service Item Tasks' : 'Engagement Tasks'}
      defaultView="board"
      defaultGroupBy={serviceItemId ? 'status' : 'service_item'}
      onTaskCreate={handleTaskCreate}
      onTaskEdit={handleTaskEdit}
      compact={showInModal}
    />
  );
  
  if (showInModal) {
    return taskView;
  }
  
  return taskView;
}

// Example usage in an Engagement Details page:
/*
import { Tabs } from '@mantine/core';
import { EngagementTaskView } from './EngagementTaskView';

export function EngagementDetailPage() {
  const { engagementId } = useParams();
  
  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
        <Tabs.Tab value="documents">Documents</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panel value="overview">
        // Overview content
      </Tabs.Panel>
      
      <Tabs.Panel value="tasks">
        <EngagementTaskView engagementId={Number(engagementId)} />
      </Tabs.Panel>
      
      <Tabs.Panel value="documents">
        // Documents content
      </Tabs.Panel>
    </Tabs>
  );
}
*/