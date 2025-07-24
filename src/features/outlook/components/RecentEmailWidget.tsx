import { useState, useEffect } from 'react';
import { 
  Card, 
  Group, 
  Text, 
  Badge, 
  Stack, 
  Skeleton, 
  ActionIcon,
  Tooltip,
  Paper,
  UnstyledButton,
  Box,
  rem,
  Alert
} from '@mantine/core';
import { 
  IconMail, 
  IconPaperclip, 
  IconRefresh, 
  IconExternalLink,
  IconAlertCircle,
  IconMailOpened
} from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import { CRMEmail, CRMEmailFilter } from '@/services/graph/types';
import { useRecentEmails } from '../api/useGetEmails';

interface RecentEmailWidgetProps {
  entityType: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId: number;
  entityCode?: string;
  relatedCodes?: string[];
  maxItems?: number;
  showRefresh?: boolean;
  onEmailClick?: (email: CRMEmail) => void;
  className?: string;
  loadDelay?: number; // Delay before loading data (for staggering requests)
}

export function RecentEmailWidget({
  entityType,
  entityId,
  entityCode,
  relatedCodes = [],
  maxItems = 5,
  showRefresh = true,
  onEmailClick,
  className,
  loadDelay = 0
}: RecentEmailWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canLoad, setCanLoad] = useState(loadDelay === 0);
  
  // Apply load delay if specified
  useEffect(() => {
    if (loadDelay > 0) {
      const timer = setTimeout(() => setCanLoad(true), loadDelay);
      return () => clearTimeout(timer);
    }
  }, [loadDelay]);
  
  // Build filter for email query
  const filter: CRMEmailFilter = {
    entityType,
    entityId,
    entityCode,
    relatedCodes: relatedCodes,
    maxItems,
    orderBy: 'receivedDateTime',
    orderDirection: 'desc'
  };
  
  // Fetch emails using the hook
  const { data, isLoading, error, refetch } = useRecentEmails(
    filter,
    canLoad && !!(entityCode || relatedCodes.length > 0)
  );
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
  const handleEmailClick = (email: CRMEmail) => {
    if (onEmailClick) {
      onEmailClick(email);
    } else {
      // Default behavior: open in new tab
      window.open(email.webLink, '_blank');
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card className={className} withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconMail size={20} />
            <Text fw={600}>Recent Emails</Text>
          </Group>
        </Group>
        <Stack gap="xs">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={60} />
          ))}
        </Stack>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className={className} withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconMail size={20} />
            <Text fw={600}>Recent Emails</Text>
          </Group>
        </Group>
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
          Failed to load emails
        </Alert>
      </Card>
    );
  }
  
  const emails = data?.emails || [];
  
  return (
    <Card className={className} withBorder>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconMail size={20} />
          <Text fw={600}>Recent Emails</Text>
          {emails.length > 0 && (
            <Badge size="sm" variant="light" color="gray">
              {emails.length}
            </Badge>
          )}
        </Group>
        {showRefresh && (
          <Tooltip label="Refresh emails">
            <ActionIcon 
              variant="subtle" 
              onClick={handleRefresh}
              loading={isRefreshing}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      
      {emails.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          No emails found
        </Text>
      ) : (
        <Stack gap="xs">
          {emails.map((email: any) => (
            <EmailItem 
              key={email.id} 
              email={email} 
              onClick={() => handleEmailClick(email)}
              isHighlighted={email.isHighlighted}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}

interface EmailItemProps {
  email: CRMEmail;
  onClick: () => void;
  isHighlighted?: boolean;
}

function EmailItem({ email, onClick, isHighlighted }: EmailItemProps) {
  return (
    <UnstyledButton onClick={onClick}>
      <Paper 
        p="sm" 
        withBorder 
        style={{ 
          borderColor: isHighlighted ? 'var(--mantine-color-blue-3)' : undefined,
          backgroundColor: !email.isRead ? 'var(--mantine-color-blue-0)' : undefined,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        className="hover-card"
      >
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              {!email.isRead && <IconMailOpened size={14} color="var(--mantine-color-blue-6)" />}
              <Text size="sm" fw={!email.isRead ? 600 : 400} truncate>
                {email.subject}
              </Text>
            </Group>
            
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed" truncate style={{ maxWidth: rem(200) }}>
                {email.sender.name || email.sender.email}
              </Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">
                {formatDate(email.receivedDateTime)}
              </Text>
            </Group>
            
            {email.snippet && (
              <Text size="xs" c="dimmed" mt={4} truncate>
                {email.snippet}
              </Text>
            )}
            
            {email.relatedEntityCodes.length > 0 && (
              <Group gap={4} mt={4}>
                {email.relatedEntityCodes.slice(0, 2).map((code) => (
                  <Badge key={code} size="xs" variant="light">
                    {code}
                  </Badge>
                ))}
                {email.relatedEntityCodes.length > 2 && (
                  <Text size="xs" c="dimmed">
                    +{email.relatedEntityCodes.length - 2} more
                  </Text>
                )}
              </Group>
            )}
          </Box>
          
          <Group gap="xs" wrap="nowrap">
            {email.hasAttachments && (
              <Tooltip label="Has attachments">
                <IconPaperclip size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
              </Tooltip>
            )}
            {email.importance === 'high' && (
              <Badge size="xs" color="red" variant="light">
                High
              </Badge>
            )}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                // Handle external link click here if needed
                window.open(`mailto:${email.sender.email}`, '_blank');
              }}
              style={{
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: 'var(--mantine-color-gray-6)',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  color: 'var(--mantine-color-gray-7)'
                }
              }}
              className="hover:bg-gray-100"
            >
              <IconExternalLink size={14} />
            </Box>
          </Group>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}