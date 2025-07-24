import { 
  Paper, 
  Group, 
  Text, 
  Button, 
  ActionIcon,
  Transition,
  Badge
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

export interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: string;
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  confirmMessage?: string;
  disabled?: boolean;
}

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  position?: 'top' | 'bottom';
}

export function BulkActions({ 
  selectedCount, 
  actions, 
  onClear,
  position = 'top' 
}: BulkActionsProps) {
  const isVisible = selectedCount > 0;

  return (
    <Transition
      mounted={isVisible}
      transition="slide-up"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          p="md"
          withBorder
          shadow="sm"
          style={{
            ...styles,
            position: 'sticky',
            [position]: 0,
            zIndex: 100,
            backgroundColor: 'var(--mantine-color-blue-0)',
            borderColor: 'var(--mantine-color-blue-2)'
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm">
              <Badge size="lg" variant="filled">
                {selectedCount} selected
              </Badge>
              <Text size="sm" c="dimmed">
                {selectedCount === 1 ? 'item' : 'items'}
              </Text>
            </Group>

            <Group gap="xs">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'light'}
                  color={action.color}
                  leftSection={action.icon}
                  onClick={() => {
                    if (action.confirmMessage) {
                      if (window.confirm(action.confirmMessage)) {
                        action.onClick();
                      }
                    } else {
                      action.onClick();
                    }
                  }}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}
              
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={onClear}
                title="Clear selection"
              >
                <IconX size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      )}
    </Transition>
  );
}