import { CommunicationTab } from '@/components/communication/CommunicationTab';

interface EngagementEmailsProps {
  engagementId: number;
}

export function EngagementEmails({ engagementId }: EngagementEmailsProps) {
  return (
    <CommunicationTab
      entityType="engagement"
      entityId={engagementId}
      entityName="Engagement"
    />
  );
}