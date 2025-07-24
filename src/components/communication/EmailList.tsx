import { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Avatar,
  Loader,
  Center,
  Alert,
  Card,
  Tooltip
} from '@mantine/core';
import {
  IconPaperclip,
  IconExternalLink,
  IconLink,
  IconAlertCircle,
  IconInbox
} from '@tabler/icons-react';
import { EmailListItem } from './types';
import { EmailDetailDrawer } from './EmailDetailDrawer';

interface EmailListProps {
  emails: EmailListItem[];
  loading: boolean;
  error: string | null;
  entityType: string;
  entityId: number;
}

export function EmailList({ emails, loading, error, entityType, entityId }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEmailClick = (email: EmailListItem) => {
    setSelectedEmail(email);
    setDrawerOpen(true);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-IN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  const getImportanceBadge = (importance: string) => {
    if (importance === 'high') {
      return <Badge size="xs" color="red" variant="light">High</Badge>;
    }
    if (importance === 'low') {
      return <Badge size="xs" color="gray" variant="light">Low</Badge>;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading emails...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error loading emails">
        Failed to load emails from Outlook. Please try again later.
      </Alert>
    );
  }

  if (emails.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <IconInbox size={48} stroke={1} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <div style={{ textAlign: 'center' }}>
            <Text fw={500} c="dimmed">No emails found</Text>
            <Text size="sm" c="dimmed">
              No email communications found for this entity.
            </Text>
          </div>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <Stack gap="xs" style={{ height: '100%', overflow: 'auto' }}>
          {emails.map((email) => (
            <Card
              key={email.id}
              p="md"
              radius="sm"
              withBorder
              style={{
                cursor: 'pointer',
                backgroundColor: email.isRead 
                  ? 'var(--mantine-color-white)' 
                  : 'var(--mantine-color-blue-0)',
                borderLeft: email.isRead 
                  ? '3px solid transparent' 
                  : '3px solid var(--mantine-color-blue-6)'
              }}
              onClick={() => handleEmailClick(email)}
            >
              <Stack gap="xs">
                {/* Header Row */}
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                    <Avatar size="sm" color="blue">
                      {getInitials(email.from.emailAddress.name)}
                    </Avatar>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Group gap="xs" align="center" wrap="nowrap">
                        <Text 
                          size="sm" 
                          fw={email.isRead ? 400 : 600}
                          truncate
                          style={{ flex: 1 }}
                        >
                          {email.from.emailAddress.name}
                        </Text>
                        {email.isLinked && (
                          <Tooltip label="Linked to CRM">
                            <IconLink size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                          </Tooltip>
                        )}
                      </Group>
                      <Text size="xs" c="dimmed" truncate>
                        {email.from.emailAddress.address}
                      </Text>
                    </Box>
                  </Group>
                  
                  <Group gap="xs" align="center">
                    {getImportanceBadge(email.importance)}
                    {email.hasAttachments && (
                      <Tooltip label="Has attachments">
                        <IconPaperclip size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                      </Tooltip>
                    )}
                    <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(email.receivedDateTime)}
                    </Text>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(email.webLink, '_blank');
                      }}
                    >
                      <IconExternalLink size={14} />
                    </ActionIcon>
                  </Group>
                </Group>

                {/* Subject */}
                <Text 
                  size="sm" 
                  fw={email.isRead ? 400 : 600}
                  lineClamp={1}
                  style={{ marginLeft: 40 }} // Align with sender name
                >
                  {email.subject}
                </Text>

                {/* Preview */}
                <Text 
                  size="xs" 
                  c="dimmed" 
                  lineClamp={2}
                  style={{ marginLeft: 40 }} // Align with sender name
                >
                  {email.bodyPreview}
                </Text>

                {/* Recipients (if outbound) */}
                {email.toRecipients.length > 0 && (
                  <Group gap="xs" style={{ marginLeft: 40 }}>
                    <Text size="xs" c="dimmed">To:</Text>
                    <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
                      {email.toRecipients.map(r => r.emailAddress.name).join(', ')}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>

      <EmailDetailDrawer
        email={selectedEmail}
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entityType={entityType}
        entityId={entityId}
      />
    </>
  );
}