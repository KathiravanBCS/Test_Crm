import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Paper,
  Title,
  Alert,
  LoadingOverlay,
  Textarea,
  Text,
  Tabs,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { toApiDate, fromApiDate } from '@/lib/utils/date';
import { 
  IconAlertCircle, 
  IconBuilding, 
  IconCurrencyRupee, 
  IconFileText,
  IconUser,
  IconWorldWww,
} from '@tabler/icons-react';
import { PanInput } from '@/components/forms/inputs/PanInput';
import { GstinInput, validateGSTIN } from '@/components/forms/inputs/GstinInput';
import { validatePAN } from '@/components/forms/inputs/PanInput';
import { BranchSelector } from '@/components/forms/pickers/BranchSelector';
import { Can } from '@/components/auth/Can';
import { Customer, CustomerFormData } from '@/types/customer';
import { useGetCustomer } from '../api/useGetCustomer';
import { useCreateCustomer } from '../api/useCreateCustomer';
import { useUpdateCustomer } from '../api/useUpdateCustomer';
import { PartnerPicker } from './PartnerPicker';

interface CustomerFormProps {
  customerId?: number;
  mode: 'create' | 'edit';
}

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'other', label: 'Other' },
];

const segmentOptions = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'mid_market', label: 'Mid Market' },
  { value: 'small_business', label: 'Small Business' },
  { value: 'startup', label: 'Startup' },
];

const paymentTermOptions = [
  { value: 'net_0', label: 'Immediate Payment' },
  { value: 'net_7', label: 'Net 7 Days' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: 'net_90', label: 'Net 90 Days' },
  { value: 'custom', label: 'Custom Terms' },
];

export function CustomerForm({ customerId, mode }: CustomerFormProps) {
  const navigate = useNavigate();
  const isEditMode = mode === 'edit';

  // Fetch customer data if editing
  const { data: customer, isLoading, error } = useGetCustomer(
    isEditMode ? customerId : undefined
  );

  // Mutations
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  // Form setup
  const form = useForm<CustomerFormData>({
    initialValues: {
      customerCode: '',
      customerName: '',
      customerType: 'direct',
      vstnBranchId: 1, // Default to first branch
      industry: '',
      customerSegment: '',
      partnerId: undefined,
      partnershipNote: '',
      currencyCode: 'INR',
      pan: '',
      gstin: '',
      tan: '',
      webUrl: '',
      paymentTerm: 'net_30',
      customerDescription: '',
      onboardedDate: new Date(),
    },
    validate: {
      customerName: (value) => !value ? 'Customer name is required' : null,
      customerType: (value) => !value ? 'Customer type is required' : null,
      vstnBranchId: (value) => !value ? 'Branch is required' : null,
      currencyCode: (value) => !value ? 'Currency is required' : null,
      partnerId: (value, values) => {
        if ((values.customerType === 'partner_referred' || values.customerType === 'partner_managed') && !value) {
          return 'Partner is required for this customer type';
        }
        return null;
      },
      pan: (value) => value ? validatePAN(value) : null,
      gstin: (value) => value ? validateGSTIN(value) : null,
      tan: (value) => {
        if (!value) return null;
        const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
        return tanRegex.test(value) ? null : 'Invalid TAN format';
      },
      webUrl: (value) => {
        if (!value) return null;
        try {
          new URL(value);
          return null;
        } catch {
          return 'Invalid URL format';
        }
      },
    },
  });

  // Load customer data when editing
  useEffect(() => {
    if (isEditMode && customer) {
      form.setValues({
        customerCode: customer.customerCode || '',
        customerName: customer.customerName,
        customerType: customer.customerType,
        vstnBranchId: customer.vstnBranchId || 1,
        industry: customer.industry || '',
        customerSegment: customer.customerSegment || '',
        partnerId: customer.partnerId,
        partnershipNote: customer.partnershipNote || '',
        currencyCode: customer.currencyCode,
        pan: customer.pan || '',
        gstin: customer.gstin || '',
        tan: customer.tan || '',
        webUrl: customer.webUrl || '',
        paymentTerm: customer.paymentTerm || 'net_30',
        customerDescription: customer.customerDescription || '',
        onboardedDate: customer.onboardedDate instanceof Date 
          ? customer.onboardedDate 
          : fromApiDate(customer.onboardedDate as string) || new Date(),
      });
    }
  }, [customer, isEditMode]);

  const handleSubmit = (values: CustomerFormData) => {
    // Convert Date to API format
    const formData = {
      ...values,
      onboardedDate: toApiDate(values.onboardedDate as Date) || undefined,
    };

    if (isEditMode && customerId) {
      updateCustomerMutation.mutate(
        { id: customerId, data: formData },
        {
          onSuccess: () => {
            navigate(`/customers/${customerId}`);
          },
        }
      );
    } else {
      createCustomerMutation.mutate(formData, {
        onSuccess: (newCustomer: Customer) => {
          navigate(`/customers/${newCustomer.id}`);
        },
      });
    }
  };

  const isSubmitting = createCustomerMutation.isPending || updateCustomerMutation.isPending;

  if (isEditMode && isLoading) {
    return <LoadingOverlay visible />;
  }

  if (isEditMode && error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        {error.message || 'Failed to load customer data'}
      </Alert>
    );
  }

  const showPartnerFields = form.values.customerType === 'partner_referred' || form.values.customerType === 'partner_managed';

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <Paper p="lg" withBorder>
          <Title order={3} mb="lg">
            {isEditMode ? 'Edit Customer' : 'New Customer'}
          </Title>

          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic" leftSection={<IconUser size={16} />}>
                Basic Information
              </Tabs.Tab>
              <Tabs.Tab value="business" leftSection={<IconBuilding size={16} />}>
                Business Details
              </Tabs.Tab>
              <Tabs.Tab value="financial" leftSection={<IconCurrencyRupee size={16} />}>
                Financial & Tax
              </Tabs.Tab>
              {showPartnerFields && (
                <Tabs.Tab value="partner" leftSection={<IconFileText size={16} />}>
                  Partnership
                </Tabs.Tab>
              )}
            </Tabs.List>

            <Tabs.Panel value="basic" pt="md">
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Customer Code"
                    placeholder="Auto-generated"
                    disabled={!isEditMode}
                    {...form.getInputProps('customerCode')}
                    description="Unique identifier for the customer"
                  />
                  <DateField
                    label="Onboarded Date"
                    value={form.values.onboardedDate instanceof Date ? form.values.onboardedDate : form.values.onboardedDate ? new Date(form.values.onboardedDate) : null}
                    onChange={(value) => form.setFieldValue('onboardedDate', value || undefined)}
                    error={form.errors.onboardedDate}
                  />
                </SimpleGrid>

                <TextInput
                  label="Customer Name"
                  placeholder="Enter customer name"
                  required
                  {...form.getInputProps('customerName')}
                />

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <BranchSelector
                    {...form.getInputProps('vstnBranchId')}
                    value={String(form.values.vstnBranchId)}
                    onChange={(value) => form.setFieldValue('vstnBranchId', value ? Number(value) : undefined)}
                    required
                    withAsterisk
                  />

                  <Select
                    label="Customer Type"
                    placeholder="Select customer type"
                    required
                    data={[
                      { value: 'direct', label: 'Direct' },
                      { value: 'partner_referred', label: 'Partner Referred' },
                      { value: 'partner_managed', label: 'Partner Managed' },
                    ]}
                    {...form.getInputProps('customerType')}
                  />
                </SimpleGrid>

                <Select
                  label="Customer Segment"
                  placeholder="Select segment"
                  data={segmentOptions}
                  {...form.getInputProps('customerSegment')}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="business" pt="md">
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select
                    label="Industry"
                    placeholder="Select industry"
                    searchable
                    data={industryOptions}
                    {...form.getInputProps('industry')}
                  />

                  <TextInput
                    label="Website"
                    placeholder="https://example.com"
                    leftSection={<IconWorldWww size={16} />}
                    {...form.getInputProps('webUrl')}
                  />
                </SimpleGrid>

                <Textarea
                  label="Description"
                  placeholder="Enter customer description"
                  rows={4}
                  {...form.getInputProps('customerDescription')}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="financial" pt="md">
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select
                    label="Currency"
                    placeholder="Select currency"
                    required
                    data={[
                      { value: 'INR', label: 'INR - Indian Rupee' },
                      { value: 'USD', label: 'USD - US Dollar' },
                      { value: 'AED', label: 'AED - UAE Dirham' },
                    ]}
                    {...form.getInputProps('currencyCode')}
                  />

                  <Select
                    label="Payment Terms"
                    placeholder="Select payment terms"
                    data={paymentTermOptions}
                    {...form.getInputProps('paymentTerm')}
                  />
                </SimpleGrid>

                <Divider label="Tax Information" labelPosition="left" />

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <PanInput
                    label="PAN"
                    placeholder="ABCDE1234F"
                    {...form.getInputProps('pan')}
                  />

                  <TextInput
                    label="TAN"
                    placeholder="ABCD12345E"
                    {...form.getInputProps('tan')}
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => 
                      form.setFieldValue('tan', e.currentTarget.value.toUpperCase())
                    }
                  />
                </SimpleGrid>

                <GstinInput
                  label="GSTIN"
                  placeholder="22ABCDE1234F1Z5"
                  {...form.getInputProps('gstin')}
                />
              </Stack>
            </Tabs.Panel>

            {showPartnerFields && (
              <Tabs.Panel value="partner" pt="md">
                <Stack gap="md">
                  <PartnerPicker
                    label="Partner"
                    placeholder="Select partner"
                    required
                    {...form.getInputProps('partnerId')}
                    description={
                      form.values.customerType === 'partner_referred'
                        ? 'This partner referred the customer to VSTN'
                        : 'This partner manages the customer relationship'
                    }
                  />

                  <Textarea
                    label="Partnership Notes"
                    placeholder="Enter any notes about the partnership"
                    rows={4}
                    {...form.getInputProps('partnershipNote')}
                  />
                </Stack>
              </Tabs.Panel>
            )}
          </Tabs>
        </Paper>

        <Group justify="space-between">
          <Button
            variant="subtle"
            onClick={() => navigate(isEditMode ? `/customers/${customerId}` : '/customers')}
          >
            Cancel
          </Button>
          
          <Can I={isEditMode ? 'update' : 'create'} a="Customer">
            <Button type="submit" loading={isSubmitting}>
              {isEditMode ? 'Save Changes' : 'Create Customer'}
            </Button>
          </Can>
        </Group>
      </Stack>
    </form>
  );
}