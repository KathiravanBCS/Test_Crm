import { useState } from 'react';
import { 
  Stack, 
  Card, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Button,
  Modal,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconMapPin,
  IconHome,
  IconTruck,
  IconFileInvoice,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { EmptyState } from '@/components/display/EmptyState';
import { AddressForm } from '@/components/forms/AddressForm';
import type { Address } from '@/types/customer';

interface AddressManagementProps {
  addresses: Address[];
  onAdd: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'entityType' | 'entityId'>) => void;
  onUpdate: (id: number, address: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'entityType' | 'entityId'>) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function AddressManagement({ addresses, onAdd, onUpdate, onDelete, isLoading }: AddressManagementProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleSubmit = (values: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'entityType' | 'entityId'>) => {
    if (editingAddress) {
      onUpdate(editingAddress.id, values);
    } else {
      onAdd(values);
    }
    setModalOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = (address: Address) => {
    modals.openConfirmModal({
      title: 'Delete Address',
      children: (
        <Text size="sm">
          Are you sure you want to delete this address? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => onDelete(address.id),
    });
  };

  if (addresses.length === 0) {
    return (
      <Stack>
        <EmptyState
          icon={<IconMapPin size={40} />}
          title="No addresses"
          description="Add addresses to keep track of billing and shipping locations"
          height={200}
        />
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={handleAdd}
          variant="light"
        >
          Add Address
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={500}>Addresses</Text>
          <Button 
            size="xs" 
            leftSection={<IconPlus size={14} />}
            onClick={handleAdd}
          >
            Add Address
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {addresses.map((address) => (
            <Card key={address.id} withBorder p="sm">
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                  <Group gap="xs">
                    {address.isPrimary && (
                      <Badge size="sm" color="blue" leftSection={<IconHome size={12} />}>
                        Primary
                      </Badge>
                    )}
                    {address.isBilling && (
                      <Badge size="sm" color="green" leftSection={<IconFileInvoice size={12} />}>
                        Billing
                      </Badge>
                    )}
                    {address.isShipping && (
                      <Badge size="sm" color="orange" leftSection={<IconTruck size={12} />}>
                        Shipping
                      </Badge>
                    )}
                  </Group>
                  
                  <Group gap={4}>
                    <ActionIcon 
                      size="sm" 
                      variant="subtle"
                      onClick={() => handleEdit(address)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      size="sm" 
                      variant="subtle" 
                      color="red"
                      onClick={() => handleDelete(address)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Box>
                  <Text size="sm">{address.addressLine1}</Text>
                  {address.addressLine2 && (
                    <Text size="sm">{address.addressLine2}</Text>
                  )}
                  <Text size="sm">
                    {address.city}, {address.state} {address.postalCode}
                  </Text>
                  <Text size="sm">{address.country}</Text>
                </Box>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        size="lg"
      >
        <AddressForm
          address={editingAddress || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingAddress(null);
          }}
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
}