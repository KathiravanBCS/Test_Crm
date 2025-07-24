import { useState } from 'react';
import { 
  Card, 
  Stack, 
  Group, 
  Text, 
  Badge, 
  ActionIcon,
  Button,
  Avatar,
  Divider,
  ScrollArea,
  Skeleton,
  Alert,
  Paper,
  Tooltip,
  Box,
  Collapse,
  rem
} from '@mantine/core';
import { 
  IconX, 
  IconExternalLink, 
  IconPaperclip,
  IconDownload,
  IconMail,
  IconMailForward,
  IconCornerUpLeft,
  IconPrinter,
  IconStar,
  IconStarFilled,
  IconChevronDown,
  IconChevronUp,
  IconAlertCircle
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { formatDateTime } from '@/lib/utils/date';
import { useEmailDetails } from '../api/useGetEmails';
import { CRMEmail, CRMEmailDetails } from '@/services/graph/types';

interface EmailDetailPanelProps {
  email: CRMEmail;
  onClose?: () => void;
  onReply?: () => void;
  onForward?: () => void;
}

export function EmailDetailPanel({
  email,
  onClose,
  onReply,
  onForward
}: EmailDetailPanelProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [showFullHeaders, { toggle: toggleHeaders }] = useDisclosure(false);
  
  // Fetch full email details including body
  const { data: emailDetails, isLoading, error } = useEmailDetails(email.id);
  
  const handleOpenInOutlook = () => {
    window.open(email.webLink, '_blank');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <Card withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Stack gap="sm" mb="md">
        <Group justify="space-between">
          <Group>
            <IconMail size={24} />
            <Text fw={600} size="lg">Email Details</Text>
          </Group>
          <Group>
            <ActionIcon
              variant="subtle"
              onClick={() => setIsStarred(!isStarred)}
            >
              {isStarred ? (
                <IconStarFilled size={20} style={{ color: 'var(--mantine-color-yellow-6)' }} />
              ) : (
                <IconStar size={20} />
              )}
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handlePrint}>
              <IconPrinter size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handleOpenInOutlook}>
              <IconExternalLink size={20} />
            </ActionIcon>
            {onClose && (
              <ActionIcon variant="subtle" onClick={onClose}>
                <IconX size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        
        {/* Action Buttons */}
        <Group>
          <Button
            variant="default"
            size="sm"
            leftSection={<IconCornerUpLeft size={16} />}
            onClick={onReply}
          >
            Reply
          </Button>
          <Button
            variant="default"
            size="sm"
            leftSection={<IconMailForward size={16} />}
            onClick={onForward}
          >
            Forward
          </Button>
        </Group>
      </Stack>
      
      <Divider />
      
      {/* Email Content */}
      <ScrollArea style={{ flex: 1 }} mt="md">
        {isLoading ? (
          <Stack gap="md">
            <Skeleton height={60} />
            <Skeleton height={200} />
          </Stack>
        ) : error ? (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            Failed to load email details
          </Alert>
        ) : emailDetails ? (
          <Stack gap="md">
            {/* Subject */}
            <Box>
              <Text fw={600} size="lg">{emailDetails.subject}</Text>
              {emailDetails.relatedEntityCodes.length > 0 && (
                <Group gap={4} mt="xs">
                  {emailDetails.relatedEntityCodes.map((code: string) => (
                    <Badge key={code} size="sm" variant="light">
                      {code}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>
            
            {/* Headers */}
            <Paper withBorder p="md">
              <Stack gap="sm">
                {/* From */}
                <Group wrap="nowrap">
                  <Avatar size="md" radius="xl">
                    {(emailDetails.sender.name || emailDetails.sender.email).charAt(0).toUpperCase()}
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {emailDetails.sender.name || emailDetails.sender.email}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {emailDetails.sender.email}
                    </Text>
                  </Box>
                  <Text size="xs" c="dimmed">
                    {formatDateTime(emailDetails.receivedDateTime)}
                  </Text>
                </Group>
                
                {/* Collapsible headers */}
                <Box>
                  <UnstyledButton onClick={toggleHeaders}>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {showFullHeaders ? 'Hide' : 'Show'} details
                      </Text>
                      {showFullHeaders ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    </Group>
                  </UnstyledButton>
                  
                  <Collapse in={showFullHeaders}>
                    <Stack gap="xs" mt="sm">
                      {/* To */}
                      <Box>
                        <Text size="xs" c="dimmed">To:</Text>
                        <Group gap="xs">
                          {emailDetails.recipients.map((recipient: any, idx: number) => (
                            <Badge key={idx} size="sm" variant="light">
                              {recipient.name || recipient.email}
                            </Badge>
                          ))}
                        </Group>
                      </Box>
                      
                      {/* CC */}
                      {emailDetails.ccRecipients.length > 0 && (
                        <Box>
                          <Text size="xs" c="dimmed">Cc:</Text>
                          <Group gap="xs">
                            {emailDetails.ccRecipients.map((recipient: any, idx: number) => (
                              <Badge key={idx} size="sm" variant="light" color="gray">
                                {recipient.name || recipient.email}
                              </Badge>
                            ))}
                          </Group>
                        </Box>
                      )}
                      
                      {/* Importance */}
                      {emailDetails.importance !== 'normal' && (
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">Importance:</Text>
                          <Badge 
                            size="sm" 
                            color={emailDetails.importance === 'high' ? 'red' : 'blue'}
                            variant="light"
                          >
                            {emailDetails.importance}
                          </Badge>
                        </Group>
                      )}
                    </Stack>
                  </Collapse>
                </Box>
              </Stack>
            </Paper>
            
            {/* Attachments */}
            {emailDetails.attachments.length > 0 && (
              <Paper withBorder p="md">
                <Group mb="sm">
                  <IconPaperclip size={16} />
                  <Text size="sm" fw={500}>
                    Attachments ({emailDetails.attachments.length})
                  </Text>
                </Group>
                <Stack gap="xs">
                  {emailDetails.attachments.map((attachment: any) => (
                    <Group key={attachment.id} justify="space-between">
                      <Group gap="xs">
                        <IconPaperclip size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm">{attachment.name}</Text>
                        <Text size="xs" c="dimmed">
                          ({formatFileSize(attachment.size)})
                        </Text>
                      </Group>
                      <Tooltip label="Download">
                        <ActionIcon variant="subtle" size="sm">
                          <IconDownload size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}
            
            {/* Email Body */}
            <Paper withBorder p="md">
              {emailDetails.body.contentType === 'html' ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: emailDetails.body.content }}
                  style={{
                    fontSize: rem(14),
                    lineHeight: 1.6,
                    wordBreak: 'break-word'
                  }}
                  className="email-content"
                />
              ) : (
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {emailDetails.body.content}
                </Text>
              )}
            </Paper>
          </Stack>
        ) : null}
      </ScrollArea>
    </Card>
  );
}

interface UnstyledButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

function UnstyledButton({ onClick, children }: UnstyledButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit'
      }}
    >
      {children}
    </button>
  );
}