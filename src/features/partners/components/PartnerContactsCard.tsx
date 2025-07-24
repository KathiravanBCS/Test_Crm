import { useState } from 'react';
import { Card, Stack, Text, Group, Button, ActionIcon, Badge, Avatar, Divider, Collapse, Grid, TextInput, Switch } from '@mantine/core';
import { IconUsers, IconPlus, IconEdit, IconTrash, IconMail, IconPhone, IconUser, IconChevronDown, IconChevronUp, IconX, IconCheck } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import type { ContactPersonFormData } from '@/types/common';

interface PartnerContactsCardProps {
  contacts: ContactPersonFormData[];
  editable?: boolean;
  onUpdate?: (contacts: ContactPersonFormData[]) => void;
}

export function PartnerContactsCard({ contacts = [], editable = false, onUpdate }: PartnerContactsCardProps) {
  const [expandedContacts, setExpandedContacts] = useState<Set<number>>(new Set());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [tempContact, setTempContact] = useState<ContactPersonFormData>({
    name: '',
    designation: '',
    email: '',
    phone: '',
    isPrimary: false,
  });

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedContacts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedContacts(newExpanded);
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setEditingIndex(null);
    setTempContact({
      name: '',
      designation: '',
      email: '',
      phone: '',
      isPrimary: contacts.length === 0,
    });
  };

  const handleSaveNew = () => {
    if (tempContact.name.trim()) {
      if (onUpdate) {
        onUpdate([...contacts, tempContact]);
      }
      setAddingNew(false);
      setTempContact({
        name: '',
        designation: '',
        email: '',
        phone: '',
        isPrimary: false,
      });
    }
  };

  const handleCancelNew = () => {
    setAddingNew(false);
    setTempContact({
      name: '',
      designation: '',
      email: '',
      phone: '',
      isPrimary: false,
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setAddingNew(false);
    setTempContact({ ...contacts[index] });
  };

  const handleSaveEdit = () => {
    if (tempContact.name.trim() && editingIndex !== null) {
      if (onUpdate) {
        const updatedContacts = [...contacts];
        updatedContacts[editingIndex] = tempContact;
        onUpdate(updatedContacts);
      }
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempContact({
      name: '',
      designation: '',
      email: '',
      phone: '',
      isPrimary: false,
    });
  };

  const handleDelete = (index: number) => {
    modals.openConfirmModal({
      title: 'Delete Contact',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{contacts[index].name}</strong>?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (onUpdate) {
          const updatedContacts = contacts.filter((_, i) => i !== index);
          // If we deleted the primary contact, make the first one primary
          if (contacts[index].isPrimary && updatedContacts.length > 0) {
            updatedContacts[0].isPrimary = true;
          }
          onUpdate(updatedContacts);
        }
      },
    });
  };

  const handleSetPrimary = (index: number) => {
    if (onUpdate) {
      const updatedContacts = contacts.map((contact, i) => ({
        ...contact,
        isPrimary: i === index,
      }));
      onUpdate(updatedContacts);
    }
  };

  const ContactForm = ({ contact, onChange }: { contact: ContactPersonFormData; onChange: (contact: ContactPersonFormData) => void }) => (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Name"
          placeholder="Enter contact name"
          required
          value={contact.name}
          onChange={(e) => onChange({ ...contact, name: e.target.value })}
          error={!contact.name.trim() && 'Name is required'}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Designation"
          placeholder="Enter designation"
          value={contact.designation || ''}
          onChange={(e) => onChange({ ...contact, designation: e.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={contact.email || ''}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Phone"
          placeholder="Enter phone number"
          value={contact.phone || ''}
          onChange={(e) => onChange({ ...contact, phone: e.target.value })}
        />
      </Grid.Col>
    </Grid>
  );

  if (contacts.length === 0 && !editable) {
    return (
      <Card withBorder>
        <Stack align="center" py="xl">
          <IconUsers size={48} color="gray" />
          <Text c="dimmed" size="sm">No contact persons available</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconUsers size={20} />
            <Text fw={600}>Contact Persons</Text>
            {contacts.length > 0 && (
              <Badge size="sm" variant="light" color="gray">
                {contacts.length}
              </Badge>
            )}
          </Group>
          {editable && !addingNew && editingIndex === null && (
            <Button
              size="xs"
              variant="light"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddNew}
            >
              Add Contact
            </Button>
          )}
        </Group>

        {/* Add New Contact Form */}
        {addingNew && (
          <Card withBorder p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>New Contact</Text>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={handleCancelNew}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color="blue"
                    onClick={handleSaveNew}
                    disabled={!tempContact.name.trim()}
                  >
                    <IconCheck size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <ContactForm contact={tempContact} onChange={setTempContact} />
              <Switch
                label="Set as primary contact"
                checked={tempContact.isPrimary || false}
                onChange={(e) => setTempContact({ ...tempContact, isPrimary: e.currentTarget.checked })}
              />
            </Stack>
          </Card>
        )}

        {/* Existing Contacts */}
        {contacts.length === 0 && editable && !addingNew && (
          <Card withBorder p="lg" style={{ borderStyle: 'dashed' }}>
            <Stack align="center" gap="sm">
              <IconUsers size={32} color="gray" />
              <Text c="dimmed" size="sm">No contacts added yet</Text>
              <Button
                size="sm"
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={handleAddNew}
              >
                Add First Contact
              </Button>
            </Stack>
          </Card>
        )}

        <Stack gap="sm">
          {contacts.map((contact, index) => (
            <Card key={index} withBorder p="md">
              {editingIndex === index ? (
                // Edit Mode
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text fw={500}>Edit Contact</Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={handleCancelEdit}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        onClick={handleSaveEdit}
                        disabled={!tempContact.name.trim()}
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <ContactForm contact={tempContact} onChange={setTempContact} />
                  <Switch
                    label="Set as primary contact"
                    checked={tempContact.isPrimary || false}
                    onChange={(e) => setTempContact({ ...tempContact, isPrimary: e.currentTarget.checked })}
                  />
                </Stack>
              ) : (
                // View Mode
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Group>
                      <Avatar color="blue" radius="xl" size="md">
                        <IconUser size={20} />
                      </Avatar>
                      <div>
                        <Group gap="xs">
                          <Text fw={500}>{contact.name}</Text>
                          {contact.isPrimary && (
                            <Badge size="xs" variant="light">Primary</Badge>
                          )}
                        </Group>
                        {contact.designation && (
                          <Text size="sm" c="dimmed">{contact.designation}</Text>
                        )}
                      </div>
                    </Group>
                    <Group gap="xs">
                      {editable && (
                        <>
                          {!contact.isPrimary && contacts.length > 1 && (
                            <Button
                              size="xs"
                              variant="subtle"
                              onClick={() => handleSetPrimary(index)}
                            >
                              Set Primary
                            </Button>
                          )}
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleEdit(index)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDelete(index)}
                            disabled={contacts.length === 1}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </>
                      )}
                      <ActionIcon
                        variant="subtle"
                        onClick={() => toggleExpanded(index)}
                      >
                        {expandedContacts.has(index) ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Collapse in={expandedContacts.has(index)}>
                    <Divider my="xs" />
                    <Stack gap="xs">
                      {contact.email && (
                        <Group gap="xs">
                          <IconMail size={16} color="gray" />
                          <Text size="sm">{contact.email}</Text>
                        </Group>
                      )}
                      {contact.phone && (
                        <Group gap="xs">
                          <IconPhone size={16} color="gray" />
                          <Text size="sm">{contact.phone}</Text>
                        </Group>
                      )}
                      {!contact.email && !contact.phone && (
                        <Text size="sm" c="dimmed" fs="italic">No contact details available</Text>
                      )}
                    </Stack>
                  </Collapse>
                </Stack>
              )}
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}