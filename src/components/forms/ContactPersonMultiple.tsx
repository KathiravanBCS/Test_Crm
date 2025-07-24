import { Stack, TextInput, SimpleGrid, Button, ActionIcon, Group, Switch, Card, Badge } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

export interface ContactPersonInput {
  name: string;
  designation?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

interface ContactPersonMultipleProps {
  contacts: ContactPersonInput[];
  onChange: (contacts: ContactPersonInput[]) => void;
  errors?: Record<string, unknown>;
}

export function ContactPersonMultiple({ contacts, onChange, errors }: ContactPersonMultipleProps) {
  const addContact = () => {
    onChange([
      ...contacts,
      {
        name: '',
        designation: '',
        email: '',
        phone: '',
        isPrimary: contacts.length === 0,
      },
    ]);
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    // If we removed the primary contact, make the first one primary
    if (contacts[index].isPrimary && newContacts.length > 0) {
      newContacts[0].isPrimary = true;
    }
    onChange(newContacts);
  };

  const updateContact = (index: number, field: keyof ContactPersonInput, value: string | boolean) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    
    // If setting as primary, unset all others
    if (field === 'isPrimary' && value === true) {
      newContacts.forEach((contact, i) => {
        if (i !== index) contact.isPrimary = false;
      });
    }
    
    onChange(newContacts);
  };

  return (
    <Stack gap="md">
      {contacts.map((contact, index) => (
        <Card key={index} withBorder p="md" pos="relative">
          {contact.isPrimary && (
            <Badge 
              pos="absolute" 
              top={8} 
              right={8} 
              color="blue" 
              variant="light"
            >
              Primary
            </Badge>
          )}
          
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Switch
                label="Set as Primary Contact"
                checked={contact.isPrimary || false}
                onChange={(e) => updateContact(index, 'isPrimary', e.currentTarget.checked)}
              />
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => removeContact(index)}
                disabled={contacts.length === 1}
                title="Remove contact"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Contact Name"
                placeholder="Full name"
                required
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
                error={typeof errors === 'object' && errors !== null && `${index}.name` in errors ? String(errors[`${index}.name`]) : undefined}
              />
              <TextInput
                label="Designation"
                placeholder="e.g., CEO, Manager"
                value={contact.designation || ''}
                onChange={(e) => updateContact(index, 'designation', e.target.value)}
              />
              <TextInput
                label="Email"
                placeholder="email@example.com"
                type="email"
                value={contact.email || ''}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
                error={typeof errors === 'object' && errors !== null && `${index}.email` in errors ? String(errors[`${index}.email`]) : undefined}
              />
              <TextInput
                label="Phone"
                placeholder="+91 98765 43210"
                value={contact.phone || ''}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
                error={typeof errors === 'object' && errors !== null && `${index}.phone` in errors ? String(errors[`${index}.phone`]) : undefined}
              />
            </SimpleGrid>
          </Stack>
        </Card>
      ))}
      
      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        onClick={addContact}
        fullWidth={false}
      >
        Add Contact Person
      </Button>
    </Stack>
  );
}