import { useNavigate } from 'react-router-dom';
import { Container, Group, Button, Title, Text, Badge } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { CustomerCreateForm } from '../components/CustomerCreateForm';

export function CreateCustomerPage() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Group mb="xl" justify="space-between">
        <div>
          <Group gap="sm" mb="xs">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/customers')}
              px="xs"
            >
              Back
            </Button>
          </Group>
          <Title order={1}>Add New Customer</Title>
          <Text c="dimmed" size="lg" mt="xs">
            Register a new customer organization in the CRM system
          </Text>
        </div>
        <Badge size="lg" variant="light" color="blue">
          New Customer Registration
        </Badge>
      </Group>

      <CustomerCreateForm />
    </Container>
  );
}