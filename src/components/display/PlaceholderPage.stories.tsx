import type { Meta, StoryObj } from '@storybook/react';
import { PlaceholderPage } from './PlaceholderPage';
import { 
  IconUsers, 
  IconFileInvoice, 
  IconSettings, 
  IconChartBar,
  IconCalendar,
  IconBriefcase,
  IconCurrencyDollar,
  IconClipboardList
} from '@tabler/icons-react';

const meta: Meta<typeof PlaceholderPage> = {
  title: 'UI/PlaceholderPage',
  component: PlaceholderPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Reports',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Analytics Dashboard',
    description: 'View detailed analytics and insights about your business performance',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Team Management',
    description: 'Manage your team members and their permissions',
    icon: IconUsers,
  },
};

export const DifferentPages: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <PlaceholderPage
        title="Customers"
        description="Manage your customer relationships"
        icon={IconUsers}
      />
      <PlaceholderPage
        title="Invoices"
        description="Create and manage invoices"
        icon={IconFileInvoice}
      />
      <PlaceholderPage
        title="Settings"
        description="Configure your application settings"
        icon={IconSettings}
      />
    </div>
  ),
};

export const ReportsPage: Story = {
  args: {
    title: 'Reports',
    description: 'Generate and view various business reports',
    icon: IconChartBar,
  },
};

export const CalendarPage: Story = {
  args: {
    title: 'Calendar',
    description: 'View and manage your events and appointments',
    icon: IconCalendar,
  },
};

export const ProjectsPage: Story = {
  args: {
    title: 'Projects',
    description: 'Track and manage your ongoing projects',
    icon: IconBriefcase,
  },
};

export const BillingPage: Story = {
  args: {
    title: 'Billing',
    description: 'Manage billing and payment information',
    icon: IconCurrencyDollar,
  },
};

export const TasksPage: Story = {
  args: {
    title: 'Tasks',
    description: 'Create and manage tasks for your team',
    icon: IconClipboardList,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Human Resources Management System',
    description: 'This comprehensive module helps you manage all aspects of human resources including recruitment, onboarding, performance management, and employee records',
  },
};

export const NoDescription: Story = {
  args: {
    title: 'Dashboard',
    icon: IconChartBar,
  },
};

export const MinimalExample: Story = {
  args: {
    title: 'Coming Soon',
  },
};

export const CustomStyling: Story = {
  render: () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: 20 }}>
      <PlaceholderPage
        title="Premium Features"
        description="Unlock advanced features with our premium plan"
        icon={IconSettings}
      />
    </div>
  ),
};

export const MultipleInGrid: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: 20,
      padding: 20,
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <PlaceholderPage title="Module 1" icon={IconUsers} />
      <PlaceholderPage title="Module 2" icon={IconFileInvoice} />
      <PlaceholderPage title="Module 3" icon={IconChartBar} />
      <PlaceholderPage title="Module 4" icon={IconSettings} />
    </div>
  ),
};