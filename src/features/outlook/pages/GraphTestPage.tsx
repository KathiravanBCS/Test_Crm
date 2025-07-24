import { Container, Title, Text, Stack } from '@mantine/core';
import { SimpleGraphTest } from '../components/SimpleGraphTest';

export function GraphTestPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">Graph API Test</Title>
          <Text c="dimmed">
            Test Microsoft Graph API integration with simplified client-side filtering approach
          </Text>
        </div>
        
        <SimpleGraphTest />
      </Stack>
    </Container>
  );
}