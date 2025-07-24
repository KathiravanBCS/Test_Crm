import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { PlaceholderPage } from '@/components/display/PlaceholderPage';
import { 
  IconDashboard, 
  IconFileInvoice, 
  IconCheckupList,
  IconUsers as IconEmployees,
  IconUserCircle,
  IconCalendarOff,
  IconSitemap,
  IconChartBar,
  IconPackage
} from '@tabler/icons-react';

// Customer pages from our feature
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage';
import { CreateCustomerPage } from '@/features/customers/pages/CreateCustomerPage';
import { EditCustomerPage } from '@/features/customers/pages/EditCustomerPage';

// Partner pages from our feature
import { PartnerListPage } from '@/features/partners/pages/PartnerListPage';
import { PartnerDetailPage } from '@/features/partners/pages/PartnerDetailPage';
import { PartnerEditPage } from '@/features/partners/pages/PartnerEditPage';
import { PartnerCreatePage } from '@/features/partners/pages/PartnerCreatePage';

// Proposal pages from our feature
import { ProposalsPage } from '@/features/proposals/pages/ProposalsPage';
import { ProposalDetailPage } from '@/features/proposals/pages/ProposalDetailPage';
import { ProposalFormPage } from '@/features/proposals/pages/ProposalFormPage';

// Engagement Letter pages from our feature
import { EngagementLetterListPage } from '@/features/engagement-letters/pages/EngagementLetterListPage';
import { EngagementLetterDetailPage } from '@/features/engagement-letters/pages/EngagementLetterDetailPage';
import { EngagementLetterNewPage } from '@/features/engagement-letters/pages/EngagementLetterNewPage';
import { EngagementLetterEditPage } from '@/features/engagement-letters/pages/EngagementLetterEditPage';

// Engagement pages from our feature
import { EngagementsPage } from '@/features/engagements/pages/EngagementsPage';
import { EngagementEditPage } from '@/features/engagements/pages/EngagementEditPage';
import { EngagementDetailPage } from '@/features/engagements/pages/EngagementDetailPage';

// Settings pages from our feature
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

// Task pages from our feature
import { TaskPage } from '@/features/tasks/pages/TaskPage';

// Graph API Test page
import { GraphTestPage } from '@/features/outlook/pages/GraphTestPage';
import { OutlookTestPage } from '@/features/outlook/pages/OutlookTestPage';

// Document Management Example page
import { DocumentManagementExample } from '@/features/documents/examples/DocumentManagementExample';
import { SharePointTestPage } from '@/features/documents/pages/SharePointTestPage';
import { DocumentEntityTestPage } from '@/features/documents/pages/DocumentEntityTestPage';
import { DocumentUploadTestPage } from '@/features/documents/pages/DocumentUploadTestPage';

// Placeholder page components
const DashboardPage = () => (
  <PlaceholderPage
    title="Dashboard"
    description="View key metrics and insights"
    icon={IconDashboard}
  />
);

// Removed - using actual ProposalsPage component imported above

// Removed - using actual EngagementLetterListPage component imported above

// Removed - using actual EngagementsPage component imported above

const DocumentsPage = () => (
  <PlaceholderPage
    title="Documents"
    description="Manage and share documents"
    icon={IconFileInvoice}
  />
);

// Removed - using actual TaskListPage component imported above

const EmployeesPage = () => (
  <PlaceholderPage
    title="Employees"
    description="Manage employee information"
    icon={IconEmployees}
  />
);

const MyProfilePage = () => (
  <PlaceholderPage
    title="My Profile"
    description="View and edit your profile"
    icon={IconUserCircle}
  />
);

const LeavesPage = () => (
  <PlaceholderPage
    title="Leaves"
    description="Manage leave requests"
    icon={IconCalendarOff}
  />
);

const OrgChartPage = () => (
  <PlaceholderPage
    title="Organization Chart"
    description="View company structure"
    icon={IconSitemap}
  />
);

const ReportsPage = () => (
  <PlaceholderPage
    title="Reports"
    description="Generate and view reports"
    icon={IconChartBar}
  />
);

const ServiceItemsPage = () => (
  <PlaceholderPage
    title="Service Items"
    description="Manage service catalog"
    icon={IconPackage}
  />
);

// Removed - using actual SettingsPage component imported above

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'customers',
        children: [
          {
            index: true,
            element: <CustomersPage />,
          },
          {
            path: 'new',
            element: <CreateCustomerPage />,
          },
          {
            path: ':id',
            element: <CustomerDetailPage />,
          },
          {
            path: ':id/edit',
            element: <EditCustomerPage />,
          },
        ],
      },
      {
        path: 'partners',
        children: [
          {
            index: true,
            element: <PartnerListPage />,
          },
          {
            path: 'new',
            element: <PartnerCreatePage />,
          },
          {
            path: ':id',
            element: <PartnerDetailPage />,
          },
          {
            path: ':id/edit',
            element: <PartnerEditPage />,
          },
        ],
      },
      {
        path: 'proposals',
        children: [
          {
            index: true,
            element: <ProposalsPage />,
          },
          {
            path: 'new',
            element: <ProposalFormPage />,
          },
          {
            path: ':id',
            element: <ProposalDetailPage />,
          },
          {
            path: ':id/edit',
            element: <ProposalFormPage />,
          },
        ],
      },
      {
        path: 'engagement-letters',
        children: [
          {
            index: true,
            element: <EngagementLetterListPage />,
          },
          {
            path: 'new',
            element: <EngagementLetterNewPage />,
          },
          {
            path: ':id',
            element: <EngagementLetterDetailPage />,
          },
          {
            path: ':id/edit',
            element: <EngagementLetterEditPage />,
          },
        ],
      },
      {
        path: 'engagements',
        children: [
          {
            index: true,
            element: <EngagementsPage />,
          },
          {
            path: 'new',
            element: <EngagementEditPage />,
          },
          {
            path: ':id',
            element: <EngagementDetailPage />,
          },
          {
            path: ':id/edit',
            element: <EngagementEditPage />,
          },
        ],
      },
      {
        path: 'documents',
        children: [
          {
            index: true,
            element: <DocumentsPage />,
          },
          {
            path: 'example',
            element: <DocumentManagementExample />,
          },
          {
            path: 'sharepoint-test',
            element: <SharePointTestPage />,
          },
          {
            path: 'entity-test',
            element: <DocumentEntityTestPage />,
          },
          {
            path: 'upload-test',
            element: <DocumentUploadTestPage />,
          },
        ],
      },
      {
        path: 'tasks',
        element: <TaskPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'my-profile',
        element: <MyProfilePage />,
      },
      {
        path: 'leaves',
        element: <LeavesPage />,
      },
      {
        path: 'org-chart',
        element: <OrgChartPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'service-items',
        element: <ServiceItemsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'graph-api-test',
        element: <GraphTestPage />,
      },
      {
        path: 'outlook-test',
        element: <OutlookTestPage />,
      },
    ],
  },
]);