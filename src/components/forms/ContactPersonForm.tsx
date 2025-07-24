import { Stack, TextInput, Grid, Button, ActionIcon, Group, Switch, Card } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { ContactPersonFormData } from '@/types/common';

interface ContactPersonFormProps {
  contacts: ContactPersonFormData[];
  onChange: (contacts: ContactPersonFormData[]) => void;
  errors?: any;
}

export function ContactPersonForm({ contacts, onChange, errors }: ContactPersonFormProps) {
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

  const updateContact = (index: number, field: keyof ContactPersonFormData, value: any) => {
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
    <Stack>
      {contacts.map((contact, index) => (
        <Card key={index} withBorder p="md">
          <Stack>
            <Group justify="space-between">
              <Switch
                label="Primary Contact"
                checked={contact.isPrimary || false}
                onChange={(e) => updateContact(index, 'isPrimary', e.currentTarget.checked)}
              />
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => removeContact(index)}
                disabled={contacts.length === 1}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Name"
                  required
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  error={errors?.[index]?.name}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Designation"
                  value={contact.designation || ''}
                  onChange={(e) => updateContact(index, 'designation', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => updateContact(index, 'email', e.target.value)}
                  error={errors?.[index]?.email}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phone"
                  value={contact.phone || ''}
                  onChange={(e) => updateContact(index, 'phone', e.target.value)}
                  error={errors?.[index]?.phone}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>
      ))}
      
      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        onClick={addContact}
      >
        Add Contact Person
      </Button>
    </Stack>
  );
}