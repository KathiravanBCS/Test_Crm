import { useState } from 'react';
import { 
  Stack, 
  Card, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Menu,
  Avatar,
  Anchor,
} from '@mantine/core';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconEdit, 
  IconTrash,
  IconDots,
  IconBriefcase,
  IconBuilding,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { EmptyState } from '@/components/display/EmptyState';
import { Can } from '@/components/auth/Can';
import { ContactPerson } from '@/types/common';
import { useGetCustomerContacts } from '../api/useGetCustomerContacts';
import { useDeleteCustomerContact } from '../api/useDeleteCustomerContact';

interface ContactPersonListProps {
  customerId: number;
}

export function ContactPersonList({ customerId }: ContactPersonListProps) {
  const { data: contacts = [], isLoading } = useGetCustomerContacts(customerId);
  const deleteContactMutation = useDeleteCustomerContact();

  const handleDelete = (contact: ContactPerson) => {
    modals.openConfirmModal({
      title: 'Delete Contact',
      children: (
        <Text size="sm">
          Are you sure you want to remove <strong>{contact.name}</strong> as a contact person?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteContactMutation.mutate({ customerId, contactId: contact.id }),
    });
  };

  if (!isLoading && contacts.length === 0) {
    return (
      <EmptyState
        icon={<IconUser size={40} />}
        title="No contact persons"
        description="Add contact persons to keep track of your key relationships"
        height={200}
      />
    );
  }

  return (
    <Stack gap="sm">
      {contacts.map((contact: ContactPerson) => (
        <Card key={contact.id} withBorder p="sm">
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              <Avatar color="blue" radius="xl">
                <IconUser size={20} />
              </Avatar>
              <div>
                <Text fw={500}>{contact.name}</Text>
                <Group gap="xs" mt={4}>
                  {contact.designation && (
                    <Badge 
                      size="sm" 
                      variant="light" 
                      leftSection={<IconBriefcase size={12} />}
                    >
                      {contact.designation}
                    </Badge>
                  )}
                </Group>
                <Group gap="md" mt="xs">
                  {contact.email && (
                    <Anchor 
                      href={`mailto:${contact.email}`} 
                      size="sm" 
                      c="dimmed"
                      underline="hover"
                    >
                      <Group gap={4}>
                        <IconMail size={14} />
                        {contact.email}
                      </Group>
                    </Anchor>
                  )}
                  {contact.phone && (
                    <Anchor 
                      href={`tel:${contact.phone}`} 
                      size="sm" 
                      c="dimmed"
                      underline="hover"
                    >
                      <Group gap={4}>
                        <IconPhone size={14} />
                        {contact.phone}
                      </Group>
                    </Anchor>
                  )}
                </Group>
              </div>
            </Group>

            <Menu shadow="md" width={160}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Can I="update" a="ContactPerson">
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => {/* TODO: Open edit form */}}
                  >
                    Edit
                  </Menu.Item>
                </Can>

                <Can I="delete" a="ContactPerson">
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleDelete(contact)}
                  >
                    Remove
                  </Menu.Item>
                </Can>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}