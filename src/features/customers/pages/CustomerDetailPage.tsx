import { useParams, useNavigate } from 'react-router-dom';
import { Container, Group, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { CustomerDetailContent } from '../components/CustomerDetailContent';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = Number(id);
  
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/customers')}
          px="xs"
        >
          Back to Customers
        </Button>
      </Group>
      
      <CustomerDetailContent customerId={customerId} />
    </Container>
  );
}