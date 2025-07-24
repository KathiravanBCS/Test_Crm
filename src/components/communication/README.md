# Communication Components

A complete set of reusable React components for displaying and managing email and calendar communications from Microsoft Outlook 365 via MS Graph API integration.

## Overview

The Communication Tab provides a professional, Outlook-like interface for viewing emails and meetings associated with any entity in the CRM system (customers, partners, engagements, etc.).

## Features

- **Email Integration**: View, search, and manage emails from Outlook 365
- **Calendar Integration**: Display meetings and calendar events
- **Entity Linking**: Link/unlink communications to CRM entities  
- **Outlook-like UI**: Clean, professional interface similar to Outlook
- **Real-time Data**: Fetches live data from MS Graph API
- **Responsive Design**: Works on desktop and tablet screens
- **Type Safety**: Full TypeScript support

## Components

### CommunicationTab
Main container component that provides tabbed interface for emails and meetings.

```tsx
import { CommunicationTab } from '@/components/communication';

<CommunicationTab
  entityType="customer"
  entityId={123}
  entityName="ACME Corp"
/>
```

### EmailList & EmailDetailDrawer
Displays list of emails with detailed view in drawer.

```tsx
import { EmailList, EmailDetailDrawer } from '@/components/communication';

const { data: emails, isLoading } = useGraphEmails({
  entityType: 'customer',
  entityId: 123,
  search: 'transfer pricing',
  days: 30
});

<EmailList
  emails={emails || []}
  loading={isLoading}
  error={null}
  entityType="customer"
  entityId={123}
/>
```

### MeetingList & MeetingDetailDrawer
Displays calendar events with detailed view in drawer.

```tsx
import { MeetingList, MeetingDetailDrawer } from '@/components/communication';

const { data: events, isLoading } = useGraphCalendarEvents({
  entityType: 'engagement',
  entityId: 456
});

<MeetingList
  events={events || []}
  loading={isLoading}
  error={null}
  entityType="engagement"
  entityId={456}
/>
```

## Usage Examples

### In a Customer Detail Page

```tsx
// features/customers/pages/CustomerDetailPage.tsx
import { CommunicationTab } from '@/components/communication';

export function CustomerDetailPage() {
  const { id } = useParams();
  const { data: customer } = useGetCustomer(id);

  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="communication">Communication</Tabs.Tab>
        <Tabs.Tab value="engagements">Engagements</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="communication">
        <CommunicationTab
          entityType="customer"
          entityId={parseInt(id)}
          entityName={customer?.name}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
```

### In an Engagement Detail Page

```tsx
// features/engagements/pages/EngagementDetailPage.tsx
import { CommunicationTab } from '@/components/communication';

export function EngagementDetailPage() {
  const { id } = useParams();
  const { data: engagement } = useGetEngagement(id);

  return (
    <Grid>
      <Grid.Col span={8}>
        {/* Engagement details */}
      </Grid.Col>
      <Grid.Col span={4}>
        <CommunicationTab
          entityType="engagement"
          entityId={parseInt(id)}
          entityName={engagement?.title}
        />
      </Grid.Col>
    </Grid>
  );
}
```

### Custom Integration

```tsx
// Custom component using individual pieces
import { useGraphEmails, EmailList } from '@/components/communication';

export function CustomerEmails({ customerId }: { customerId: number }) {
  const { data: emails, isLoading, refetch } = useGraphEmails({
    entityType: 'customer',
    entityId: customerId,
    days: 7 // Last week only
  });

  return (
    <Card>
      <Card.Header>
        <Group justify="space-between">
          <Text fw={600}>Recent Emails</Text>
          <ActionIcon onClick={() => refetch()}>
            <IconRefresh />
          </ActionIcon>
        </Group>
      </Card.Header>
      <EmailList
        emails={emails?.slice(0, 5) || []} // Show only 5 most recent
        loading={isLoading}
        error={null}
        entityType="customer"
        entityId={customerId}
      />
    </Card>
  );
}
```

## API Integration

The components use TanStack Query hooks that fetch data from Microsoft Graph API:

### Mock Data (Development)
Currently includes mock data for development. The hooks return realistic sample data that matches the MS Graph API structure.

### Production Implementation
Replace the mock functions in the hooks with actual MS Graph API calls:

```tsx
// hooks/useGraphEmails.ts
async function fetchGraphEmails(params: EmailsQueryParams) {
  // Replace with actual MS Graph API call
  const response = await graphClient
    .api('/me/messages')
    .filter(`contains(subject,'${params.search}')`)
    .top(params.limit || 20)
    .get();

  return {
    data: response.value,
    total: response.value.length,
    page: params.page || 1,
    limit: params.limit || 20,
    hasMore: response['@odata.nextLink'] !== undefined
  };
}
```

## Database Integration

The components work with the existing database schema:

### Email Sync
- `linked_email` table stores references to Graph API emails
- Tracks which emails are linked to which CRM entities
- Stores metadata for offline access

### Calendar Sync  
- `calendar_sync` table stores references to Graph API events
- Supports bidirectional sync between CRM and Outlook
- Tracks meeting associations with engagements/tasks

## Styling & Theming

Components use Mantine v8 styling system:
- Consistent with existing CRM design language
- Supports light/dark themes
- Professional, Outlook-inspired appearance
- Responsive design for various screen sizes

## Error Handling

- Graceful degradation when MS Graph API is unavailable
- User-friendly error messages
- Retry logic for transient failures
- Loading states for better UX

## Performance

- TanStack Query for efficient caching
- Pagination support for large datasets
- Debounced search to reduce API calls
- Optimistic updates for link/unlink operations

## Security

- Follows MS Graph API authentication patterns
- No sensitive data stored in frontend state
- Respects email/calendar permissions from Azure AD
- Audit trail through existing `audit_log` table

## Future Enhancements

- Real-time email/calendar notifications
- Email composition within CRM
- Meeting scheduling integration
- Advanced search and filtering
- Bulk operations (link multiple emails)
- Email templates for common scenarios