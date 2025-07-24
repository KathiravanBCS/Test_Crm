import type { Meta, StoryObj } from '@storybook/react';
import { ContactPersonForm } from './ContactPersonForm';
import { useState } from 'react';

const meta: Meta<typeof ContactPersonForm> = {
  title: 'UI/ContactPersonForm',
  component: ContactPersonForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ContactPersonFormWrapper = (props: any) => {
  const [contacts, setContacts] = useState(props.contacts || []);
  
  return (
    <ContactPersonForm
      {...props}
      contacts={contacts}
      onChange={setContacts}
    />
  );
};

export const Default: Story = {
  render: () => <ContactPersonFormWrapper contacts={[]} />,
};

export const WithInitialContact: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: 'John Doe',
          designation: 'CEO',
          email: 'john@example.com',
          phone: '+91 98765 43210',
          is_primary: true,
        },
      ]}
    />
  ),
};

export const MultipleContacts: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: 'John Doe',
          designation: 'CEO',
          email: 'john@example.com',
          phone: '+91 98765 43210',
          is_primary: true,
        },
        {
          name: 'Jane Smith',
          designation: 'CFO',
          email: 'jane@example.com',
          phone: '+91 98765 43211',
          is_primary: false,
        },
        {
          name: 'Mike Johnson',
          designation: 'CTO',
          email: 'mike@example.com',
          phone: '+91 98765 43212',
          is_primary: false,
        },
      ]}
    />
  ),
};

export const WithValidationErrors: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: '',
          designation: 'Manager',
          email: 'invalid-email',
          phone: '1234',
          is_primary: true,
        },
      ]}
      errors={[
        {
          name: 'Name is required',
          email: 'Please enter a valid email address',
          phone: 'Please enter a valid phone number',
        },
      ]}
    />
  ),
};

export const EmptyForm: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: '',
          designation: '',
          email: '',
          phone: '',
          is_primary: true,
        },
      ]}
    />
  ),
};

export const PrimaryContactSwitch: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: 'Primary Contact',
          designation: 'Manager',
          email: 'primary@example.com',
          phone: '+91 98765 43210',
          is_primary: true,
        },
        {
          name: 'Secondary Contact',
          designation: 'Assistant',
          email: 'secondary@example.com',
          phone: '+91 98765 43211',
          is_primary: false,
        },
      ]}
    />
  ),
};

export const LongFormData: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={[
        {
          name: 'Christopher Alexander Rodriguez',
          designation: 'Senior Vice President of Operations and Strategy',
          email: 'christopher.alexander.rodriguez@verylongcompanyname.com',
          phone: '+91 98765 43210',
          is_primary: true,
        },
      ]}
    />
  ),
};

export const MaxContacts: Story = {
  render: () => (
    <ContactPersonFormWrapper
      contacts={Array.from({ length: 5 }, (_, i) => ({
        name: `Contact Person ${i + 1}`,
        designation: ['Manager', 'Developer', 'Designer', 'Analyst', 'Consultant'][i],
        email: `contact${i + 1}@example.com`,
        phone: `+91 98765 432${10 + i}`,
        is_primary: i === 0,
      }))}
    />
  ),
};

export const WithCallback: Story = {
  render: () => {
    const [contacts, setContacts] = useState([
      {
        name: 'John Doe',
        designation: 'CEO',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        is_primary: true,
      },
    ]);
    
    const handleChange = (newContacts: any[]) => {
      console.log('Contacts updated:', newContacts);
      setContacts(newContacts);
    };
    
    return (
      <ContactPersonForm
        contacts={contacts}
        onChange={handleChange}
      />
    );
  },
};