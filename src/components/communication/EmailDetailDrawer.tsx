import {
  Drawer,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Avatar,
  Divider,
  Button,
  ScrollArea,
  Card,
  Tooltip,
  Alert,
  Box
} from '@mantine/core';
import {
  IconExternalLink,
  IconPaperclip,
  IconCornerDownLeft,
  IconCornerDownRight,
  IconCornerUpRight,
  IconLink,
  IconUnlink,
  IconMail,
  IconInfoCircle
} from '@tabler/icons-react';
import { EmailListItem } from './types';

interface EmailDetailDrawerProps {
  email: EmailListItem | null;
  opened: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
}

export function EmailDetailDrawer({ 
  email, 
  opened, 
  onClose, 
  entityType, 
  entityId 
}: EmailDetailDrawerProps) {
  if (!email) return null;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLinkToCRM = () => {
    // Implementation to link email to CRM
    console.log('Linking email to CRM:', { email: email.id, entityType, entityId });
  };

  const handleUnlinkFromCRM = () => {
    // Implementation to unlink email from CRM
    console.log('Unlinking email from CRM:', { email: email.id, entityType, entityId });
  };

  const renderEmailContent = () => {
    if (email.body.contentType === 'html') {
      return (
        <Box 
          dangerouslySetInnerHTML={{ __html: email.body.content }}
          style={{
            '& img': { maxWidth: '100%', height: 'auto' },
            '& table': { maxWidth: '100%', overflowX: 'auto' },
            '& a': { color: 'var(--mantine-color-blue-6)' }
          }}
        />
      );
    } else {
      return (
        <Text style={{ whiteSpace: 'pre-wrap' }}>
          {email.body.content}
        </Text>
      );
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Group gap="sm">
          <IconMail size={20} />
          <Text fw={600}>Email Details</Text>
        </Group>
      }
      padding="md"
    >
      <Stack gap="md" h="100%">
        {/* Email Header */}
        <Card withBorder p="md">
          <Stack gap="sm">
            {/* Subject and Actions */}
            <Group justify="space-between" align="flex-start">
              <Text size="lg" fw={600} style={{ flex: 1 }}>
                {email.subject}
              </Text>
              <Group gap="xs">
                {email.importance === 'high' && (
                  <Badge size="sm" color="red" variant="light">
                    High Priority
                  </Badge>
                )}
                {email.hasAttachments && (
                  <Tooltip label="Has attachments">
                    <IconPaperclip size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  </Tooltip>
                )}
              </Group>
            </Group>

            {/* Sender Info */}
            <Group gap="sm">
              <Avatar size="md" color="blue">
                {getInitials(email.from.emailAddress.name)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Group gap="xs" align="center">
                  <Text fw={500}>{email.from.emailAddress.name}</Text>
                  {email.isLinked && (
                    <Tooltip label="Linked to CRM">
                      <IconLink size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                    </Tooltip>
                  )}
                </Group>
                <Text size="sm" c="dimmed">{email.from.emailAddress.address}</Text>
              </div>
            </Group>

            {/* Recipients */}
            {email.toRecipients.length > 0 && (
              <div>
                <Text size="sm" c="dimmed" fw={500} mb="xs">To:</Text>
                <Stack gap="xs">
                  {email.toRecipients.map((recipient, index) => (
                    <Group key={index} gap="xs">
                      <Avatar size="xs" color="gray">
                        {getInitials(recipient.emailAddress.name)}
                      </Avatar>
                      <div>
                        <Text size="sm">{recipient.emailAddress.name}</Text>
                        <Text size="xs" c="dimmed">{recipient.emailAddress.address}</Text>
                      </div>
                    </Group>
                  ))}
                </Stack>
              </div>
            )}

            {/* CC Recipients */}
            {email.ccRecipients.length > 0 && (
              <div>
                <Text size="sm" c="dimmed" fw={500} mb="xs">CC:</Text>
                <Stack gap="xs">
                  {email.ccRecipients.map((recipient, index) => (
                    <Group key={index} gap="xs">
                      <Avatar size="xs" color="gray">
                        {getInitials(recipient.emailAddress.name)}
                      </Avatar>
                      <div>
                        <Text size="sm">{recipient.emailAddress.name}</Text>
                        <Text size="xs" c="dimmed">{recipient.emailAddress.address}</Text>
                      </div>
                    </Group>
                  ))}
                </Stack>
              </div>
            )}

            {/* Date and Time */}
            <Text size="sm" c="dimmed">
              {formatDateTime(email.receivedDateTime)}
            </Text>

            {/* CRM Link Status */}
            {email.isLinked ? (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="green" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This email is linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light" 
                    color="red"
                    leftSection={<IconUnlink size={14} />}
                    onClick={handleUnlinkFromCRM}
                  >
                    Unlink
                  </Button>
                </Group>
              </Alert>
            ) : (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="yellow" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This email is not linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light"
                    leftSection={<IconLink size={14} />}
                    onClick={handleLinkToCRM}
                  >
                    Link to CRM
                  </Button>
                </Group>
              </Alert>
            )}
          </Stack>
        </Card>

        {/* Actions */}
        <Group>
          <Button 
            variant="light" 
            leftSection={<IconCornerDownLeft size={16} />}
            onClick={() => window.open(email.webLink, '_blank')}
          >
            Reply
          </Button>
          <Button 
            variant="light" 
            leftSection={<IconCornerDownRight size={16} />}
            onClick={() => window.open(email.webLink, '_blank')}
          >
            Reply All
          </Button>
          <Button 
            variant="light" 
            leftSection={<IconCornerUpRight size={16} />}
            onClick={() => window.open(email.webLink, '_blank')}
          >
            Forward
          </Button>
          <Button 
            variant="outline" 
            leftSection={<IconExternalLink size={16} />}
            onClick={() => window.open(email.webLink, '_blank')}
          >
            Open in Outlook
          </Button>
        </Group>

        <Divider />

        {/* Email Content */}
        <Card withBorder style={{ flex: 1 }}>
          <ScrollArea h="100%" style={{ flex: 1 }}>
            <Box p="md">
              {renderEmailContent()}
            </Box>
          </ScrollArea>
        </Card>

        {/* Attachments */}
        {email.hasAttachments && email.attachments && email.attachments.length > 0 && (
          <Card withBorder p="md">
            <Text fw={500} mb="sm">Attachments ({email.attachments.length})</Text>
            <Stack gap="xs">
              {email.attachments.map((attachment, index) => (
                <Group key={index} justify="space-between" p="xs" style={{ 
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  borderRadius: 'var(--mantine-radius-sm)'
                }}>
                  <Group gap="sm">
                    <IconPaperclip size={16} />
                    <div>
                      <Text size="sm" fw={500}>{attachment.name}</Text>
                      <Text size="xs" c="dimmed">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    variant="light"
                    onClick={() => {
                      if (attachment.downloadUrl) {
                        window.open(attachment.downloadUrl, '_blank');
                      }
                    }}
                  >
                    <IconExternalLink size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Drawer>
  );
}