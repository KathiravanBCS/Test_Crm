import React from 'react';
import { Stack, Title, Text, Button, Center, ThemeIcon, Box } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'filled' | 'outline' | 'light' | 'subtle';
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction | false;
  height?: number | string;
}

export function EmptyState({ 
  icon = <IconDatabase size={48} />,
  title,
  description,
  action,
  height = 400
}: EmptyStateProps) {
  return (
    <Center h={height}>
      <Stack align="center" gap="md" maw={400}>
        {icon && (
          <ThemeIcon size={80} radius="xl" variant="light" color="gray">
            {icon}
          </ThemeIcon>
        )}
        
        <Title order={3} ta="center" c="dimmed">
          {title}
        </Title>
        
        {description && (
          <Text size="sm" c="dimmed" ta="center">
            {description}
          </Text>
        )}
        
        {action && (
          <Button 
            variant={action.variant || 'light'}
            onClick={action.onClick}
            mt="sm"
          >
            {action.label}
          </Button>
        )}
      </Stack>
    </Center>
  );
}