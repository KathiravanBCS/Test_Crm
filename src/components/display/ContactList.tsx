import { Stack, Card, Group, Text } from '@mantine/core';
import { IconPhone, IconMail, IconUser } from '@tabler/icons-react';
import type { ContactPerson } from '@/types';

interface ContactListProps {
  contacts: ContactPerson[];
  readOnly?: boolean;
  onEdit?: (contact: ContactPerson) => void;
  onDelete?: (contact: ContactPerson) => void;
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <Stack>
      {contacts.map((contact) => (
        <Card key={contact.id} withBorder p="sm">
          <Stack gap="xs">
            <Group justify="space-between">
              <Group>
                <IconUser size={16} />
                <Text fw={500}>{contact.name}</Text>
              </Group>
              {contact.designation && (
                <Text size="sm" c="dimmed">{contact.designation}</Text>
              )}
            </Group>
            
            <Group gap="lg">
              {contact.email && (
                <Group gap={4}>
                  <IconMail size={14} />
                  <Text size="sm" component="a" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </Text>
                </Group>
              )}
              {contact.phone && (
                <Group gap={4}>
                  <IconPhone size={14} />
                  <Text size="sm" component="a" href={`tel:${contact.phone}`}>
                    {contact.phone}
                  </Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}