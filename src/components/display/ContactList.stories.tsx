import type { Meta, StoryObj } from '@storybook/react';
import { ContactList } from './ContactList';
import type { ContactPerson } from '@/types';

const meta: Meta<typeof ContactList> = {
  title: 'UI/ContactList',
  component: ContactList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockContacts: ContactPerson[] = [
  {
    id: 1,
    entityType: 'customer',
    entityId: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    designation: 'CEO',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    entityType: 'customer',
    entityId: 1,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 98765 43211',
    designation: 'CFO',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    entityType: 'customer',
    entityId: 1,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 98765 43212',
    designation: 'Technical Lead',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const Default: Story = {
  args: {
    contacts: mockContacts,
  },
};

export const SingleContact: Story = {
  args: {
    contacts: [mockContacts[0]],
  },
};

export const EmptyList: Story = {
  args: {
    contacts: [],
  },
};

export const ContactWithoutOptionalFields: Story = {
  args: {
    contacts: [
      {
        id: 4,
        entityType: 'customer',
        entityId: 2,
        name: 'Alice Brown',
      },
    ],
  },
};

export const MixedContacts: Story = {
  args: {
    contacts: [
      {
        id: 5,
        entityType: 'customer',
        entityId: 3,
        name: 'Robert Wilson',
        email: 'robert@example.com',
        phone: '+91 98765 43213',
        designation: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        entityType: 'partner',
        entityId: 1,
        name: 'Sarah Davis',
        email: 'sarah@partner.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        entityType: 'customer',
        entityId: 4,
        name: 'Tom Anderson',
        phone: '+91 98765 43214',
        designation: 'Consultant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
};

export const LongContactInfo: Story = {
  args: {
    contacts: [
      {
        id: 8,
        entityType: 'customer',
        entityId: 5,
        name: 'Christopher Alexander Rodriguez',
        email: 'christopher.alexander.rodriguez@verylongcompanyname.com',
        phone: '+91 98765 43215',
        designation: 'Senior Vice President of Operations',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
};

export const ReadOnlyMode: Story = {
  args: {
    contacts: mockContacts,
    readOnly: true,
  },
};

export const WithCallbacks: Story = {
  args: {
    contacts: mockContacts.slice(0, 2),
    onEdit: (contact: ContactPerson) => alert(`Edit contact: ${contact.name}`),
    onDelete: (contact: ContactPerson) => alert(`Delete contact: ${contact.name}`),
  },
};

export const ManyContacts: Story = {
  args: {
          contacts: Array.from({ length: 10 }, (_, i) => ({
        id: i + 10,
        entityType: 'customer' as const,
        entityId: Math.floor(i / 3) + 1,
        name: `Contact Person ${i + 1}`,
        email: `contact${i + 1}@example.com`,
        phone: `+91 98765 432${20 + i}`,
        designation: ['Manager', 'Developer', 'Designer', 'Analyst'][i % 4],
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
  },
};