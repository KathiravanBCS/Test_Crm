import { Card, Collapse, Group, Button, Badge, Stack } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface AdvancedFiltersProps {
  opened: boolean;
  onToggle: () => void;
  onReset: () => void;
  filterCount: number;
  children: ReactNode;
}

export function AdvancedFilters({
  opened,
  onToggle,
  onReset,
  filterCount,
  children
}: AdvancedFiltersProps) {
  return (
    <Card>
      <Group justify="space-between" mb={opened ? 'md' : 0}>
        <Button
          variant="subtle"
          leftSection={<IconFilter size={16} />}
          onClick={onToggle}
          rightSection={
            filterCount > 0 && (
              <Badge size="sm" circle variant="filled">
                {filterCount}
              </Badge>
            )
          }
        >
          Advanced Filters
        </Button>
        
        {opened && filterCount > 0 && (
          <Button
            variant="subtle"
            size="xs"
            onClick={onReset}
            leftSection={<IconX size={14} />}
          >
            Clear all
          </Button>
        )}
      </Group>
      
      <Collapse in={opened}>
        <Stack gap="md" pt="sm">
          {children}
        </Stack>
      </Collapse>
    </Card>
  );
}