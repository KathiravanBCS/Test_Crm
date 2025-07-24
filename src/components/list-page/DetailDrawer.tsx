import { Drawer, Group, Title, ActionIcon, LoadingOverlay, Alert } from '@mantine/core';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface DetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  loading?: boolean;
  error?: Error | null;
  onFullPageClick?: () => void;
  children: ReactNode;
}

export function DetailDrawer({
  opened,
  onClose,
  title,
  loading = false,
  error = null,
  onFullPageClick,
  children
}: DetailDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      title={
        <Group justify="space-between" style={{ width: '100%' }}>
          <Title order={3}>{title || 'Details'}</Title>
          <Group gap="xs">
            {onFullPageClick && (
              <ActionIcon 
                variant="subtle" 
                onClick={onFullPageClick}
                title="View full page"
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            )}           
          </Group>
        </Group>
      }
      styles={{
        header: { borderBottom: '1px solid var(--mantine-color-gray-3)' },
        body: { paddingTop: 'var(--mantine-spacing-md)' }
      }}
    >
      <LoadingOverlay visible={loading} />
      
      {error ? (
        <Alert color="red" title="Error loading details">
          {error.message}
        </Alert>
      ) : (
        children
      )}
    </Drawer>
  );
}