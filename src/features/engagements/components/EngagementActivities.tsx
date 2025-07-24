import { CommentsTab } from '@/features/comments/components/CommentsTab';
import { useAuth } from '@/lib/auth/useAuth';

interface EngagementActivitiesProps {
  engagementId: number;
}

export function EngagementActivities({ engagementId }: EngagementActivitiesProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <CommentsTab
      entityType="engagement"
      entityId={engagementId}
      currentUserId={user.id}
    />
  );
}