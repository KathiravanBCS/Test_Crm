import type { Meta, StoryObj } from '@storybook/react';
import { InfoField } from './InfoField';
import { IconMail, IconPhone, IconMapPin, IconCalendar } from '@tabler/icons-react';
import { SimpleGrid } from '@mantine/core';

const meta: Meta<typeof InfoField> = {
  title: 'UI/InfoField',
  component: InfoField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Customer Name',
    value: 'John Doe',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email',
    value: 'john.doe@example.com',
    icon: <IconMail size={16} />,
  },
};

export const EmptyValue: Story = {
  args: {
    label: 'Phone Number',
    value: null,
    icon: <IconPhone size={16} />,
  },
};

export const NumericValue: Story = {
  args: {
    label: 'Total Orders',
    value: 42,
  },
};

export const FormLayout: Story = {
  render: () => (
    <SimpleGrid cols={2} spacing="md" style={{ maxWidth: 400 }}>
      <InfoField 
        label="Email" 
        value="contact@company.com" 
        icon={<IconMail size={16} />} 
      />
      <InfoField 
        label="Phone" 
        value="+1 (555) 123-4567" 
        icon={<IconPhone size={16} />} 
      />
      <InfoField 
        label="Address" 
        value="123 Main St, City" 
        icon={<IconMapPin size={16} />} 
      />
      <InfoField 
        label="Joined Date" 
        value="Jan 15, 2024" 
        icon={<IconCalendar size={16} />} 
      />
    </SimpleGrid>
  ),
};

export const ContactCard: Story = {
  render: () => (
    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', maxWidth: 300 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Contact Information</h3>
      <SimpleGrid cols={1} spacing="md">
        <InfoField label="Full Name" value="Sarah Johnson" />
        <InfoField label="Email" value="sarah.j@example.com" icon={<IconMail size={16} />} />
        <InfoField label="Phone" value="+1 (555) 987-6543" icon={<IconPhone size={16} />} />
        <InfoField label="Location" value="New York, NY" icon={<IconMapPin size={16} />} />
      </SimpleGrid>
    </div>
  ),
};