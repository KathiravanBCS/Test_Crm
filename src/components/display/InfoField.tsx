import { Group, Text, Stack } from '@mantine/core';
import type { ReactNode } from 'react';

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
}

export function InfoField({ label, value, icon }: InfoFieldProps) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed">{label}</Text>
      <Group gap="xs">
        {icon}
        <Text size="sm" fw={500}>
          {value || '-'}
        </Text>
      </Group>
    </Stack>
  );
}