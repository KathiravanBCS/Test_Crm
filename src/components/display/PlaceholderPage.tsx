import { Container, Title, Text, Stack, Paper, Center } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <Container size="xl" p="md">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">
            {Icon && <Icon size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {title}
          </Title>
          <Text c="dimmed">{description || `This is the ${title} page`}</Text>
        </div>

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Center style={{ height: 400, flexDirection: 'column' }}>
            <IconInfoCircle size={48} color="gray" style={{ marginBottom: 16 }} />
            <Text size="lg" c="dimmed" ta="center">
              This page is under construction
            </Text>
            <Text size="sm" c="dimmed" ta="center" mt="xs">
              Content for {title} will be displayed here
            </Text>
          </Center>
        </Paper>
      </Stack>
    </Container>
  );
}