import { useEffect } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Grid,
  Divider,
  Textarea,
  Card,
  Title,
  Text,
  Alert,
} from '@mantine/core';
import {
  IconCurrency,
  IconMail,
  IconPhone,
  IconWorld,
  IconBriefcase,
  IconCategory,
  IconCalendar,
  IconInfoCircle,
} from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { PanInput } from '@/components/forms/inputs/PanInput';
import { GstinInput } from '@/components/forms/inputs/GstinInput';
import { AddressFields } from '@/components/forms/inputs/AddressFields';
import { ContactPersonForm } from '@/components/forms/ContactPersonForm';
import { PartnerPicker } from './PartnerPicker';
import { BranchSelector } from '@/components/forms/pickers/BranchSelector';
import type { CustomerType } from '@/types/common';

export interface CustomerFormValues {
  customerName: string;
  customerType: CustomerType;
  vstnBranchId?: number;
  partnerId?: number;
  currencyCode: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  webUrl?: string;
  paymentTerm?: string;
  customerDescription?: string;
  industry?: string;
  customerSegment?: string;
  onboardedDate?: Date;
  contacts?: Array<{
    name: string;
    designation?: string;
    email?: string;
    phone?: string;
    isPrimary?: boolean;
  }>;
}

interface CustomerFormComponentProps {
  form: UseFormReturnType<CustomerFormValues>;
  mode: 'create' | 'edit';
}

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' },
];

const customerSegmentOptions = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'mid-market', label: 'Mid-Market' },
  { value: 'smb', label: 'Small Business' },
  { value: 'startup', label: 'Startup' },
  { value: 'government', label: 'Government' },
  { value: 'non-profit', label: 'Non-Profit' },
];

const currencyOptions = [
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'AED', label: 'AED - UAE Dirham' },
];

const customerTypeOptions = [
  { value: 'direct', label: 'Direct' },
  { value: 'partner_referred', label: 'Partner Referred' },
  { value: 'partner_managed', label: 'Partner Managed' },
];

function getCustomerTypeDescription(type: CustomerType): string {
  switch (type) {
    case 'direct':
      return 'Customer is directly managed and invoiced by VSTN';
    case 'partner_referred':
      return 'Customer was referred by a partner.';
    case 'partner_managed':
      return 'VSTN works on behalf of the partner';
    default:
      return '';
  }
}

export function CustomerFormComponent({ form, mode }: CustomerFormComponentProps) {
  const formValues = form.getValues();
  const showPartnerField = formValues.customerType === 'partner_referred' || formValues.customerType === 'partner_managed';

  return (
    <Stack gap="xl">
      {/* Basic Information Section */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <Title order={4} mb="sm">Basic Information</Title>
          
          <TextInput
            label="Customer Name"
            placeholder="Enter company name"
            required
            size="md"
            {...form.getInputProps('customerName')}
            description="Legal name of the customer organization"
          />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <BranchSelector
                label="Branch"
                placeholder="Select branch"
                required
                size="md"
                {...form.getInputProps('vstnBranchId')}
                value={formValues.vstnBranchId?.toString()}
                onChange={(value) => form.setFieldValue('vstnBranchId', value ? parseInt(value) : undefined)}
                description="VSTN branch managing this customer"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Customer Type"
                placeholder="Select customer type"
                required
                size="md"
                data={customerTypeOptions}
                {...form.getInputProps('customerType')}
                description={getCustomerTypeDescription(formValues.customerType)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Currency"
                placeholder="Select currency"
                required
                size="md"
                leftSection={<IconCurrency size={16} />}
                data={currencyOptions}
                {...form.getInputProps('currencyCode')}
                description="Default currency for proposals and invoices"
              />
            </Grid.Col>
          </Grid>

          {showPartnerField && (
            <PartnerPicker
              label="Partner"
              placeholder="Select partner"
              required
              size="md"
              {...form.getInputProps('partnerId')}
              description={
                formValues.customerType === 'partner_referred'
                  ? 'Partner who referred this customer to VSTN'
                  : 'Partner who manages this customer relationship'
              }
            />
          )}

          <Divider label="Contact Information" labelPosition="center" my="sm" />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email"
                placeholder="company@example.com"
                size="md"
                leftSection={<IconMail size={16} />}
                {...form.getInputProps('email')}
                description="Primary contact email"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Phone"
                placeholder="9876543210"
                size="md"
                leftSection={<IconPhone size={16} />}
                {...form.getInputProps('phone')}
                description="Primary contact number"
                maxLength={10}
                onChange={(e) => {
                  const value = e.currentTarget.value.replace(/\D/g, '');
                  form.setFieldValue('phone', value);
                }}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      {/* Business Information Section */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <Title order={4} mb="sm">Business Information</Title>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Industry"
                placeholder="Select industry"
                size="md"
                leftSection={<IconBriefcase size={16} />}
                data={industryOptions}
                {...form.getInputProps('industry')}
                description="Primary industry sector"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Customer Segment"
                placeholder="Select segment"
                size="md"
                leftSection={<IconCategory size={16} />}
                data={customerSegmentOptions}
                {...form.getInputProps('customerSegment')}
                description="Customer size category"
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Website URL"
                placeholder="https://example.com"
                size="md"
                leftSection={<IconWorld size={16} />}
                {...form.getInputProps('webUrl')}
                description="Company website"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Payment Terms (Days)"
                placeholder="30"
                size="md"
                {...form.getInputProps('paymentTerm')}
                description="Default payment terms in days"
                type="number"
                min={0}
                max={365}
              />
            </Grid.Col>
          </Grid>

          <DateInput
            label="Onboarded Date"
            placeholder="Select date"
            size="md"
            leftSection={<IconCalendar size={16} />}
            {...form.getInputProps('onboardedDate')}
            description="Date when customer relationship started"
            maxDate={new Date()}
          />

          <Textarea
            label="Description"
            placeholder="Brief description about the customer, their business, special requirements, etc."
            rows={4}
            size="md"
            {...form.getInputProps('customerDescription')}
            description="Internal notes about this customer"
          />
        </Stack>
      </Card>

      {/* Tax Information Section */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <Title order={4} mb="sm">Tax Information</Title>
          
          <Text c="dimmed" size="sm">
            Tax identifiers are optional but recommended for compliance and invoicing purposes.
          </Text>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <PanInput
                label="PAN"
                placeholder="ABCDE1234F"
                size="md"
                {...form.getInputProps('pan')}
                description="Permanent Account Number"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="TAN"
                placeholder="ABCD12345E"
                size="md"
                {...form.getInputProps('tan')}
                description="Tax Deduction Account Number"
                maxLength={10}
                styles={{ input: { textTransform: 'uppercase' } }}
                onChange={(e) => 
                  form.setFieldValue('tan', e.currentTarget.value.toUpperCase())
                }
              />
            </Grid.Col>
          </Grid>

          <GstinInput
            label="GSTIN"
            placeholder="22ABCDE1234F1Z5"
            size="md"
            {...form.getInputProps('gstin')}
            description="Goods and Services Tax Identification Number"
          />

          <Alert color="blue" variant="light" icon={<IconInfoCircle size={16} />}>
            Tax identifiers are used in proposals, engagement letters, and invoices
          </Alert>
        </Stack>
      </Card>

      {/* Address Information Section */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <Title order={4} mb="sm">Address Information</Title>
          <AddressFields form={form} />
        </Stack>
      </Card>

      {/* Contact Persons Section */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <div>
            <Title order={4} mb="xs">Contact Persons</Title>
            <Text c="dimmed" size="sm">
              {mode === 'create' 
                ? 'Add at least one contact person for communication' 
                : 'Manage contact persons for this customer'}
            </Text>
          </div>

          <ContactPersonForm
            contacts={formValues.contacts || []}
            onChange={(contacts) => form.setFieldValue('contacts', contacts)}
            errors={form.errors.contacts}
          />

          <Alert color="yellow" variant="light" icon={<IconInfoCircle size={16} />}>
            <Text size="sm">
              Contact persons can be added, edited, or removed anytime from the customer profile page.
            </Text>
          </Alert>
        </Stack>
      </Card>
    </Stack>
  );
}