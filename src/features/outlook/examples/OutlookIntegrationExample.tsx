import { useIsAuthenticated } from '@azure/msal-react';
import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { RecentEmailWidget } from '@/features/outlook/components/RecentEmailWidget';
import { RecentMeetingsWidget } from '@/features/outlook/components/RecentMeetingsWidget';
import { OutlookTabs } from '@/features/outlook/components/OutlookTabs';
import { useOutlookReady } from '@/features/outlook/hooks/useOutlookServices';

/**
 * Example of how to use Outlook widgets with existing MSAL authentication
 */
export function OutlookIntegrationExample() {
  const isAuthenticated = useIsAuthenticated();
  const { isReady, needsConsent } = useOutlookReady();
  
  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="yellow">
        Please sign in to view Outlook integration
      </Alert>
    );
  }
  
  // Authenticated but needs Graph permissions consent
  if (needsConsent) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="orange">
        <Stack gap="xs">
          <Text fw={500}>Additional permissions required</Text>
          <Text size="sm">
            This feature requires access to your emails and calendar. 
            Please sign out and sign in again to grant the necessary permissions.
          </Text>
        </Stack>
      </Alert>
    );
  }
  
  // Not ready yet (initializing)
  if (!isReady) {
    return <Text c="dimmed">Initializing Outlook services...</Text>;
  }
  
  // Ready to use!
  return (
    <Stack gap="lg">
      {/* Example 1: Side-by-side widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <RecentEmailWidget
          entityType="customer"
          entityId={123}
          entityCode="CUST-2025-001"
          maxItems={5}
        />
        
        <RecentMeetingsWidget
          entityType="customer"
          entityId={123}
          entityCode="CUST-2025-001"
          maxItems={5}
          showUpcoming={true}
        />
      </div>
      
      {/* Example 2: Full Outlook tabs */}
      <OutlookTabs
        entityType="proposal"
        entityId={456}
        entityCode="PROP-2025-001"
        relatedCodes={['EL-2025-001', 'ENG-2025-001']}
      />
    </Stack>
  );
}

/**
 * Example of initializing Outlook services at app level
 * Add this to your App.tsx or main layout
 */
import { useOutlookServices } from '@/features/outlook/hooks/useOutlookServices';

export function AppWithOutlook({ children }: { children: React.ReactNode }) {
  // Initialize Outlook services when authenticated
  useOutlookServices();
  
  return <>{children}</>;
}