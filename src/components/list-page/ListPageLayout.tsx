import { Stack, Group, Title, Text, Card } from '@mantine/core';
import { ReactNode } from 'react';

interface ListPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}

export function ListPageLayout({
  title,
  description,
  actions,
  filters,
  children
}: ListPageLayoutProps) {
  return (
    <Stack gap="md">
      {/* Header */}
      <Card>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{title}</Title>
            {description && (
              <Text c="dimmed" size="sm" mt={4}>
                {description}
              </Text>
            )}
          </div>
          {actions && <Group gap="sm">{actions}</Group>}
        </Group>
      </Card>

      {/* Filters */}
      {filters && filters}

      {/* Content */}
      {children}
    </Stack>
  );
}