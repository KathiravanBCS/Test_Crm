import { useState, useCallback } from 'react';
import { 
  Grid, 
  Card, 
  Stack, 
  TextInput, 
  Select, 
  Group, 
  Button,
  Badge,
  Text,
  ScrollArea,
  Skeleton,
  Alert,
  ActionIcon,
  Box,
  Checkbox,
  UnstyledButton,
  Paper,
  rem,
  Tooltip,
  Avatar,
  Divider
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconRefresh, 
  IconMail,
  IconMailOpened,
  IconPaperclip,
  IconStar,
  IconStarFilled,
  IconExternalLink,
  IconAlertCircle,
  IconInbox,
  IconSend,
  IconX
} from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useRecentEmails } from '../api/useGetEmails';
import { CRMEmail, CRMEmailFilter } from '@/services/graph/types';
import { formatDateTime } from '@/lib/utils/date';
import { EmailDetailPanel } from './EmailDetailPanel';

interface EmailViewerProps {
  entityType?: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId?: number;
  entityCode?: string;
  relatedCodes?: string[];
  defaultView?: 'inbox' | 'sent';
  onEmailSelect?: (email: CRMEmail) => void;
}

export function EmailViewer({
  entityType,
  entityId,
  entityCode,
  relatedCodes = [],
  defaultView = 'inbox',
  onEmailSelect
}: EmailViewerProps) {
  const [selectedEmail, setSelectedEmail] = useState<CRMEmail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'all'>(defaultView);
  const [hasAttachmentsFilter, setHasAttachmentsFilter] = useState(false);
  const [importanceFilter, setImportanceFilter] = useState<string | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  
  // Build filter
  // Only add entity filtering if entityCode is provided
  const filter: CRMEmailFilter = {
    ...(entityCode && { entityType }),
    ...(entityCode && { entityId }),
    ...(entityCode && { entityCode }),
    ...(entityCode && relatedCodes.length > 0 && { relatedCodes }),
    folder: folder === 'all' ? undefined : folder,
    search: debouncedSearch,
    hasAttachments: hasAttachmentsFilter ? true : undefined,
    importance: importanceFilter as CRMEmailFilter['importance'],
    maxItems: 50,
    orderBy: 'receivedDateTime',
    orderDirection: 'desc'
  };
  
  // Fetch emails
  const { data, isLoading, error, refetch } = useRecentEmails(filter);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
  const handleEmailClick = (email: CRMEmail) => {
    setSelectedEmail(email);
    if (onEmailSelect) {
      onEmailSelect(email);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map((e: CRMEmail) => e.id));
    }
  };
  
  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFolder('inbox');
    setHasAttachmentsFilter(false);
    setImportanceFilter(null);
  };
  
  const emails = data?.emails || [];
  const hasActiveFilters = debouncedSearch || hasAttachmentsFilter || importanceFilter || folder !== 'inbox';
  
  // Debug logging
  console.log('[EmailViewer] Debug:', {
    dataReceived: !!data,
    emailCount: emails.length,
    isLoading,
    error,
    filter,
    rawData: data
  });
  
  return (
    <Grid gutter="md" style={{ height: '100%' }}>
      {/* Email List Panel */}
      <Grid.Col span={selectedEmail ? 5 : 12}>
        <Card withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Stack gap="sm" mb="md">
            <Group justify="space-between">
              <Group>
                <IconMail size={24} />
                <Text fw={600} size="lg">Emails</Text>
                {emails.length > 0 && (
                  <Badge size="lg" variant="light" color="gray">
                    {emails.length}
                  </Badge>
                )}
              </Group>
              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={handleRefresh}
                  loading={isRefreshing}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Group>
            </Group>
            
            {/* Search and Filters */}
            <TextInput
              placeholder="Search emails..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              rightSection={
                searchQuery && (
                  <ActionIcon variant="subtle" onClick={() => setSearchQuery('')}>
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
            
            <Group>
              <Select
                data={[
                  { value: 'inbox', label: 'Inbox' },
                  { value: 'sent', label: 'Sent' },
                  { value: 'all', label: 'All Folders' }
                ]}
                value={folder}
                onChange={(value) => setFolder((value || 'inbox') as typeof folder)}
                leftSection={folder === 'inbox' ? <IconInbox size={16} /> : <IconSend size={16} />}
                style={{ flex: 1 }}
              />
              
              <Button
                variant={hasAttachmentsFilter ? 'filled' : 'default'}
                size="sm"
                leftSection={<IconPaperclip size={16} />}
                onClick={() => setHasAttachmentsFilter(!hasAttachmentsFilter)}
              >
                Attachments
              </Button>
              
              <Select
                placeholder="Importance"
                data={[
                  { value: 'high', label: 'High' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'low', label: 'Low' }
                ]}
                value={importanceFilter}
                onChange={setImportanceFilter}
                clearable
                style={{ width: rem(120) }}
              />
              
              {hasActiveFilters && (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={clearFilters}
                  leftSection={<IconX size={16} />}
                >
                  Clear
                </Button>
              )}
            </Group>
            
            {selectedEmails.length > 0 && (
              <Group>
                <Checkbox
                  checked={selectedEmails.length === emails.length}
                  indeterminate={selectedEmails.length > 0 && selectedEmails.length < emails.length}
                  onChange={handleSelectAll}
                />
                <Text size="sm">
                  {selectedEmails.length} selected
                </Text>
                <Button size="xs" variant="subtle" onClick={() => setSelectedEmails([])}>
                  Clear selection
                </Button>
              </Group>
            )}
          </Stack>
          
          <Divider />
          
          {/* Email List */}
          <ScrollArea style={{ flex: 1 }} mt="md">
            {isLoading ? (
              <Stack gap="xs">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={80} />
                ))}
              </Stack>
            ) : error ? (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                Failed to load emails
              </Alert>
            ) : emails.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                {hasActiveFilters ? 'No emails match your filters' : 'No emails found'}
              </Text>
            ) : (
              <Stack gap={0}>
                {emails.map((email: CRMEmail) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    isChecked={selectedEmails.includes(email.id)}
                    onCheck={() => toggleEmailSelection(email.id)}
                    onClick={() => handleEmailClick(email)}
                  />
                ))}
              </Stack>
            )}
          </ScrollArea>
        </Card>
      </Grid.Col>
      
      {/* Email Detail Panel */}
      {selectedEmail && (
        <Grid.Col span={7}>
          <EmailDetailPanel
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}

interface EmailListItemProps {
  email: CRMEmail;
  isSelected: boolean;
  isChecked: boolean;
  onCheck: () => void;
  onClick: () => void;
}

function EmailListItem({ email, isSelected, isChecked, onCheck, onClick }: EmailListItemProps) {
  const [isStarred, setIsStarred] = useState(false);
  
  return (
    <UnstyledButton onClick={onClick}>
      <Paper
        p="sm"
        style={{
          backgroundColor: isSelected 
            ? 'var(--mantine-color-blue-0)' 
            : !email.isRead 
              ? 'var(--mantine-color-gray-0)' 
              : undefined,
          borderLeft: isSelected ? `3px solid var(--mantine-color-blue-6)` : undefined,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        className="hover-highlight"
      >
        <Group wrap="nowrap" gap="sm">
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation();
              onCheck();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              setIsStarred(!isStarred);
            }}
          >
            {isStarred ? (
              <IconStarFilled size={16} style={{ color: 'var(--mantine-color-yellow-6)' }} />
            ) : (
              <IconStar size={16} />
            )}
          </ActionIcon>
          
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group justify="space-between" wrap="nowrap" mb={4}>
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <Avatar size="sm" radius="xl">
                  {(email.sender.name || email.sender.email).charAt(0).toUpperCase()}
                </Avatar>
                <Text 
                  size="sm" 
                  fw={!email.isRead ? 600 : 400} 
                  truncate
                  style={{ flex: 1 }}
                >
                  {email.sender.name || email.sender.email}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {formatDateTime(email.receivedDateTime)}
              </Text>
            </Group>
            
            <Text 
              size="sm" 
              fw={!email.isRead ? 600 : 400} 
              truncate 
              mb={4}
            >
              {email.subject}
            </Text>
            
            <Text size="xs" c="dimmed" truncate>
              {email.snippet}
            </Text>
            
            <Group gap={4} mt={4}>
              {!email.isRead && <IconMailOpened size={14} color="var(--mantine-color-blue-6)" />}
              {email.hasAttachments && (
                <Tooltip label="Has attachments">
                  <IconPaperclip size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                </Tooltip>
              )}
              {email.importance === 'high' && (
                <Badge size="xs" color="red" variant="light">
                  High
                </Badge>
              )}
              {email.relatedEntityCodes.map((code) => (
                <Badge key={code} size="xs" variant="light">
                  {code}
                </Badge>
              ))}
            </Group>
          </Box>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}