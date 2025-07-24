import { Button, Badge } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

interface FilterTriggerProps {
  count: number;
  onClick: () => void;
}

export function FilterTrigger({ count, onClick }: FilterTriggerProps) {
  return (
    <Button
      variant="light"
      leftSection={<IconFilter size={16} />}
      rightSection={count > 0 ? <Badge size="sm" variant="filled">{count}</Badge> : null}
      onClick={onClick}
    >
      Filters
    </Button>
  );
}