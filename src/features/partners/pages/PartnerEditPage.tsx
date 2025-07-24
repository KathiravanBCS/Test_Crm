import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Button,
  Group,
  Tabs,
  Stack,
  LoadingOverlay,
  Alert,
  Badge,
  rem,
  Textarea,
  NumberInput,
  SegmentedControl,
  Text,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconBuilding,
  IconBuildingBank,
  IconUsers,
  IconMapPin,
  IconX,
  IconAlertCircle,
  IconPercentage,
  IconCash,
  IconCalendar,
  IconWorld,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { validatePAN, validateGSTIN } from '@/lib/utils/validators';
import { useGetPartner } from '../api/useGetPartner';
import { useUpdatePartner } from '../api/useUpdatePartner';
import { PartnerInfoCard } from '../components/PartnerInfoCard';
import { PartnerContactsCard } from '../components/PartnerContactsCard';
import { BankAccountsManager } from '../components/BankAccountsManager';
import type { Partner, PartnerFormData, PartnerBankAccount } from '../types';
import type { ContactPersonFormData } from '@/types/common';
import { DateInput } from '@mantine/dates';

// Separate form components for each tab
import { TextInput, Select, Grid, Card, Divider } from '@mantine/core';
import { PanInput } from '@/components/forms/inputs/PanInput';
import { GstinInput } from '@/components/forms/inputs/GstinInput';
import { BranchSelector } from '@/components/forms/pickers/BranchSelector';
import { IconCurrency } from '@tabler/icons-react';
import { AddressListManager } from '@/components/forms/address/AddressListManager';

export function PartnerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const partnerId = parseInt(id || '0');
  const [activeTab, setActiveTab] = useState<string | null>('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { data: partner, isLoading, error } = useGetPartner(partnerId);
  const updateMutation = useUpdatePartner(partnerId);
  
  const form = useForm<PartnerFormData>({
    initialValues: {
      partnerCode: '',
      partnerName: '',
      partnerType: 'firm',
      vstnBranchId: 1,
      pan: '',
      gstin: '',
      webUrl: '',
      currencyCode: 'INR',
      paymentTerm: 'Net 30',
      commissionType: 'percentage',
      commissionRate: 10,
      commissionCurrencyCode: 'INR',
      partnerDescription: '',
      onboardedDate: new Date().toISOString(),
      // Address fields
      addresses: [],
      // Bank accounts
      bankAccounts: [],
      contacts: [],
    },
    validate: {
      partnerName: (value) => !value?.trim() ? 'Partner name is required' : null,
      pan: (value) => {
        if (!value) return null;
        return validatePAN(value) ? null : 'Invalid PAN format';
      },
      gstin: (value) => {
        if (!value) return null;
        return validateGSTIN(value) ? null : 'Invalid GSTIN format';
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
      commissionRate: (value) => {
        if (value === undefined || value === null) return 'Commission rate is required';
        if (value < 0) return 'Commission rate cannot be negative';
        if (form.values.commissionType === 'percentage' && value > 100) {
          return 'Percentage cannot exceed 100%';
        }
        return null;
      },
      bankAccounts: {
        accountNumber: (value) => {
          if (!value) return null;
          return value.trim().length >= 9 ? null : 'Invalid bank account number';
        },
        ifscCode: (value, values, path) => {
          const bankAccount = form.getInputProps(path.replace('.ifscCode', '')).value;
          if (!value || !bankAccount?.accountNumber) return null;
          const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
          return ifscRegex.test(value) ? null : 'Invalid IFSC format';
        },
      },
    },
  });

  // Load partner data into form
  useEffect(() => {
    if (partner) {
      form.setValues({
        partnerCode: partner.partnerCode,
        partnerName: partner.partnerName,
        partnerType: partner.partnerType || 'firm',
        vstnBranchId: partner.vstnBranchId || 1,
        pan: partner.pan || '',
        gstin: partner.gstin || '',
        webUrl: partner.webUrl || '',
        currencyCode: partner.currencyCode || 'INR',
        paymentTerm: partner.paymentTerm || 'Net 30',
        commissionType: partner.commissionType || 'percentage',
        commissionRate: partner.commissionRate || 10,
        commissionCurrencyCode: partner.commissionCurrencyCode || partner.currencyCode || 'INR',
        partnerDescription: partner.partnerDescription || '',
        onboardedDate: partner.onboardedDate || new Date().toISOString(),
        addresses: partner?.addresses || [],
        bankAccounts: partner.bankAccounts || [],
        contacts: partner.contacts || [],
      });
      form.resetDirty();
    }
  }, [partner]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(form.isDirty());
  }, [form.values]);

  const handleSave = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      // Switch to the tab with errors
      if (validation.errors.partnerName || validation.errors.partnerType || validation.errors.pan || validation.errors.gstin) {
        setActiveTab('basic');
      } else if (validation.errors.bankAccounts || validation.errors.commissionType || validation.errors.commissionRate) {
        setActiveTab('financial');
      }
      return;
    }

    try {
      const formData: PartnerFormData = {
        partnerCode: form.values.partnerCode,
        partnerName: form.values.partnerName,
        partnerType: form.values.partnerType,
        vstnBranchId: form.values.vstnBranchId,
        pan: form.values.pan || undefined,
        gstin: form.values.gstin || undefined,
        webUrl: form.values.webUrl || undefined,
        currencyCode: form.values.currencyCode || undefined,
        paymentTerm: form.values.paymentTerm || undefined,
        commissionType: form.values.commissionType,
        commissionRate: form.values.commissionRate,
        commissionCurrencyCode: form.values.commissionCurrencyCode || undefined,
        partnerDescription: form.values.partnerDescription || undefined,
        onboardedDate: form.values.onboardedDate || undefined,
        addresses: form.values.addresses || [],
        contacts: form.values.contacts || [],
        bankAccounts: form.values.bankAccounts || [],
      };

      await updateMutation.mutateAsync(formData);
      
      notifications.show({
        title: 'Success',
        message: 'Partner updated successfully',
        color: 'green',
      });
      
      form.resetDirty();
      navigate(`/partners/${partnerId}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      // You could add a confirmation modal here
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate(`/partners/${partnerId}`);
  };

  const handleContactsUpdate = (contacts: ContactPersonFormData[]) => {
    form.setFieldValue('contacts', contacts);
  };

  if (!partnerId) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Invalid partner ID
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Failed to load partner: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={isLoading} />
      
      {/* Header */}
      <Stack gap="xl" mb="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="sm" mb="xs">
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate(`/partners/${partnerId}`)}
                px="xs"
              >
                Back
              </Button>
              {hasUnsavedChanges && (
                <Badge color="orange" variant="light">
                  Unsaved changes
                </Badge>
              )}
            </Group>
            <Title order={1}>Edit Partner</Title>
          </div>
          
          <Group>
            <Button
              variant="light"
              color="gray"
              leftSection={<IconX size={16} />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSave}
              loading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </Group>
        </Group>

        {/* Partner Info Card */}
        {partner && (
          <PartnerInfoCard partner={{ ...partner, ...form.values } as Partner} showStatus={false} />
        )}
      </Stack>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab 
            value="basic" 
            leftSection={<IconBuilding style={{ width: rem(16), height: rem(16) }} />}
          >
            Basic Information
          </Tabs.Tab>
          <Tabs.Tab 
            value="financial" 
            leftSection={<IconCash style={{ width: rem(16), height: rem(16) }} />}
          >
            Financial & Commission
          </Tabs.Tab>
          <Tabs.Tab 
            value="address" 
            leftSection={<IconMapPin style={{ width: rem(16), height: rem(16) }} />}
          >
            Addresses
            {form.values.addresses && form.values.addresses.length > 0 && (
              <Badge size="xs" variant="filled" color="gray" ml={5}>
                {form.values.addresses.length}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab 
            value="banking" 
            leftSection={<IconBuildingBank style={{ width: rem(16), height: rem(16) }} />}
          >
            Banking Details
            {form.values.bankAccounts && form.values.bankAccounts.length > 0 && (
              <Badge size="xs" variant="filled" color="gray" ml={5}>
                {form.values.bankAccounts.length}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab 
            value="contacts" 
            leftSection={<IconUsers style={{ width: rem(16), height: rem(16) }} />}
          >
            Contact Persons
            {form.values.contacts && form.values.contacts.length > 0 && (
              <Badge size="xs" variant="filled" color="gray" ml={5}>
                {form.values.contacts.length}
              </Badge>
            )}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xl">
          <Card withBorder>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <TextInput
                    label="Partner Code"
                    placeholder="PRTN-2024-001"
                    disabled
                    {...form.getInputProps('partnerCode')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Partner Name"
                    placeholder="Enter partner name"
                    required
                    withAsterisk
                    {...form.getInputProps('partnerName')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Stack gap={5}>
                    <Text size="sm" fw={500}>Partner Type</Text>
                    <SegmentedControl
                      data={[
                        { label: 'Individual', value: 'individual' },
                        { label: 'Firm', value: 'firm' },
                      ]}
                      {...form.getInputProps('partnerType')}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <BranchSelector
                    {...form.getInputProps('vstnBranchId')}
                    value={String(form.values.vstnBranchId)}
                    onChange={(value) => form.setFieldValue('vstnBranchId', value ? Number(value) : undefined)}
                    required
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Onboarded Date"
                    placeholder="Select date"
                    leftSection={<IconCalendar size={16} />}
                    {...form.getInputProps('onboardedDate')}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Website URL"
                placeholder="https://example.com"
                leftSection={<IconWorld size={16} />}
                {...form.getInputProps('webUrl')}
              />

              <Textarea
                label="Partner Description"
                placeholder="Brief description about the partner and their services"
                rows={3}
                {...form.getInputProps('partnerDescription')}
              />

              <Divider label="Tax Information" labelPosition="center" />

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <PanInput
                    label="PAN"
                    placeholder="ABCDE1234F"
                    {...form.getInputProps('pan')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <GstinInput
                    label="GSTIN"
                    placeholder="22ABCDE1234F1Z5"
                    {...form.getInputProps('gstin')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="financial" pt="xl">
          <Card withBorder>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Currency"
                    placeholder="Select currency"
                    leftSection={<IconCurrency size={16} />}
                    data={[
                      { value: 'INR', label: 'INR - Indian Rupee' },
                      { value: 'USD', label: 'USD - US Dollar' },
                      { value: 'AED', label: 'AED - UAE Dirham' },
                    ]}
                    {...form.getInputProps('currencyCode')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Payment Terms"
                    placeholder="Select payment terms"
                    data={[
                      { value: 'Net 15', label: 'Net 15 days' },
                      { value: 'Net 30', label: 'Net 30 days' },
                      { value: 'Net 45', label: 'Net 45 days' },
                      { value: 'Net 60', label: 'Net 60 days' },
                    ]}
                    {...form.getInputProps('paymentTerm')}
                  />
                </Grid.Col>
              </Grid>

              <Divider label="Commission Settings" labelPosition="center" />

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack gap={5}>
                    <Text size="sm" fw={500}>Commission Type</Text>
                    <SegmentedControl
                      data={[
                        { 
                          label: 'Percentage', 
                          value: 'percentage',
                        },
                        { 
                          label: 'Fixed Amount', 
                          value: 'fixed',
                        },
                      ]}
                      {...form.getInputProps('commissionType')}
                    />
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <NumberInput
                    label={form.values.commissionType === 'percentage' ? 'Commission Rate (%)' : 'Commission Amount'}
                    placeholder={form.values.commissionType === 'percentage' ? '10' : '25000'}
                    required
                    withAsterisk
                    leftSection={form.values.commissionType === 'percentage' ? <IconPercentage size={16} /> : <IconCash size={16} />}
                    min={0}
                    max={form.values.commissionType === 'percentage' ? 100 : undefined}
                    decimalScale={form.values.commissionType === 'percentage' ? 2 : 0}
                    {...form.getInputProps('commissionRate')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Commission Currency"
                    placeholder="Select currency"
                    leftSection={<IconCurrency size={16} />}
                    data={[
                      { value: 'INR', label: 'INR - Indian Rupee' },
                      { value: 'USD', label: 'USD - US Dollar' },
                      { value: 'AED', label: 'AED - UAE Dirham' },
                    ]}
                    {...form.getInputProps('commissionCurrencyCode')}
                  />
                </Grid.Col>
              </Grid>

              <Alert color="blue" variant="light">
                {form.values.commissionType === 'percentage' 
                  ? `Partner will receive ${form.values.commissionRate || 0}% commission on all invoices`
                  : `Partner will receive ${form.values.commissionCurrencyCode || 'INR'} ${form.values.commissionRate || 0} fixed commission per engagement`
                }
              </Alert>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="address" pt="xl">
          <Card withBorder>
            <AddressListManager
              addresses={form.values.addresses || []}
              onUpdate={(addresses) => form.setFieldValue('addresses', addresses)}
            />
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="banking" pt="xl">
          <BankAccountsManager
            bankAccounts={form.values.bankAccounts || []}
            onUpdate={(bankAccounts) => form.setFieldValue('bankAccounts', bankAccounts)}
          />
        </Tabs.Panel>

        <Tabs.Panel value="contacts" pt="xl">
          <PartnerContactsCard
            contacts={form.values.contacts || []}
            editable={true}
            onUpdate={handleContactsUpdate}
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}