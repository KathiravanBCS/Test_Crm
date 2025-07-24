import { Group, Stack, Title, Text, Badge, Button, Menu, ActionIcon, Paper, Box } from '@mantine/core';
import { IconDots, IconEdit, IconFileDownload, IconSend } from '@tabler/icons-react';
import { StatusBadge } from '@/components/display/StatusBadge';
import { MoneyDisplay } from './MoneyDisplay';
import { formatDate } from '@/lib/utils/date';
import type { CurrencyCode } from '@/types/common';

export interface DocumentHeaderProps {
  title: string;
  documentType: 'proposal' | 'engagement_letter' | 'engagement';
  documentNumber?: string;
  status?: {
    id: number;
    status_code: string;
    status_name: string;
  };
  metadata?: {
    customer?: string;
    partner?: string;
    date?: Date;
    validUntil?: Date;
    startDate?: Date;
    endDate?: Date;
    value?: number;
    currency?: CurrencyCode;
  };
  actions?: {
    primary?: {
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      disabled?: boolean;
    };
    secondary?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      color?: string;
      disabled?: boolean;
    }>;
  };
  onStatusUpdate?: () => void;
}

const documentTypeLabels = {
  proposal: 'Proposal',
  engagement_letter: 'Engagement Letter',
  engagement: 'Engagement'
};

export function DocumentHeader({
  title,
  documentType,
  documentNumber,
  status,
  metadata,
  actions,
  onStatusUpdate
}: DocumentHeaderProps) {
  return (
    <Paper p="lg" withBorder>
      <Stack gap="md">
        {/* Title and Status Row */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" mb={4}>
              <Badge variant="outline" color="gray" size="sm">
                {documentTypeLabels[documentType]}
              </Badge>
              {documentNumber && (
                <Text size="sm" c="dimmed">{documentNumber}</Text>
              )}
            </Group>
            <Title order={2}>{title}</Title>
          </div>
          
          <Group gap="sm">
            {status && (
              <Box 
                style={{ cursor: onStatusUpdate ? 'pointer' : 'default' }}
                onClick={onStatusUpdate}
              >
                <StatusBadge 
                  status={{
                    statusCode: status.status_code,
                    statusName: status.status_name
                  }} 
                  size="lg"
                />
              </Box>
            )}
            
            {actions?.primary && (
              <Button
                leftSection={actions.primary.icon}
                onClick={actions.primary.onClick}
                disabled={actions.primary.disabled}
              >
                {actions.primary.label}
              </Button>
            )}
            
            {actions?.secondary && actions.secondary.length > 0 && (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="default" size="lg">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {actions.secondary.map((action, index) => (
                    <Menu.Item
                      key={index}
                      leftSection={action.icon}
                      onClick={action.onClick}
                      color={action.color}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>

        {/* Metadata Row */}
        {metadata && (
          <Group gap="xl">
            {metadata.customer && (
              <div>
                <Text size="sm" c="dimmed">Customer</Text>
                <Text size="sm" fw={500}>{metadata.customer}</Text>
                {metadata.partner && (
                  <Text size="xs" c="dimmed">via {metadata.partner}</Text>
                )}
              </div>
            )}
            
            {metadata.date && (
              <div>
                <Text size="sm" c="dimmed">
                  {documentType === 'engagement' ? 'Start Date' : 'Date'}
                </Text>
                <Text size="sm" fw={500}>
                  {formatDate(metadata.date)}
                </Text>
              </div>
            )}
            
            {metadata.validUntil && (
              <div>
                <Text size="sm" c="dimmed">Valid Until</Text>
                <Text size="sm" fw={500}>
                  {formatDate(metadata.validUntil)}
                </Text>
              </div>
            )}
            
            {metadata.endDate && (
              <div>
                <Text size="sm" c="dimmed">End Date</Text>
                <Text size="sm" fw={500}>
                  {formatDate(metadata.endDate)}
                </Text>
              </div>
            )}
            
            {metadata.value !== undefined && (
              <div>
                <Text size="sm" c="dimmed">Total Value</Text>
                <MoneyDisplay
                  amount={metadata.value}
                  currency={metadata.currency || 'INR'}
                  size="sm"
                  fw={500}
                />
              </div>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}