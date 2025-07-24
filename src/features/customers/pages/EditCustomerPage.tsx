import { useParams, useNavigate } from 'react-router-dom';
import { Container, Group, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { CustomerEditForm } from '../components/CustomerEditForm';

export function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = Number(id);
  
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(`/customers/${customerId}`)}
          px="xs"
        >
          Back to Customer
        </Button>
      </Group>
      
      <CustomerEditForm customerId={customerId} />
    </Container>
  );
}