import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Button,
  Group,
  Title,
  Badge,
  LoadingOverlay,
  Alert,
  Paper,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { validatePAN } from '@/lib/utils/validators';
import { validateGSTIN } from '@/components/forms/inputs/GstinInput';
import { CustomerFormComponent, type CustomerFormValues } from './CustomerFormComponent';
import { useGetCustomer } from '../api/useGetCustomer';
import { useUpdateCustomer } from '../api/useUpdateCustomer';
import type { CustomerFormData } from '../types';
import type { AddressFormData, ContactPersonFormData } from '@/types/common';

interface CustomerEditFormProps {
  customerId: number;
}

export function CustomerEditForm({ customerId }: CustomerEditFormProps) {
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { data: customer, isLoading, error } = useGetCustomer(customerId);
  const updateMutation = useUpdateCustomer();
  
  const form = useForm<CustomerFormValues>({
    initialValues: {
      customerName: '',
      customerType: 'direct',
      vstnBranchId: undefined,
      partnerId: undefined,
      currencyCode: 'INR',
      pan: '',
      gstin: '',
      tan: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'IN',
      webUrl: '',
      paymentTerm: '',
      customerDescription: '',
      industry: '',
      customerSegment: '',
      onboardedDate: undefined,
      contacts: [],
    },
    validate: {
      customerName: (value) => !value?.trim() ? 'Customer name is required' : null,
      customerType: (value) => !value ? 'Customer type is required' : null,
      vstnBranchId: (value) => !value ? 'Branch is required' : null,
      partnerId: (value, values) => {
        if ((values.customerType === 'partner_referred' || values.customerType === 'partner_managed') && !value) {
          return 'Partner is required for this customer type';
        }
        return null;
      },
      currencyCode: (value) => !value ? 'Currency is required' : null,
      pan: (value) => {
        if (!value) return null;
        return validatePAN(value) ? null : 'Invalid PAN format';
      },
      gstin: (value) => {
        if (!value) return null;
        return validateGSTIN(value) || null;
      },
      tan: (value) => {
        if (!value) return null;
        const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
        return tanRegex.test(value) ? null : 'Invalid TAN format';
      },
      email: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Invalid email format';
      },
      phone: (value) => {
        if (!value) return null;
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(value.replace(/\D/g, '')) ? null : 'Invalid phone number';
      },
      pincode: (value) => {
        // No validation for international postal codes
        return null;
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
      paymentTerm: (value) => {
        if (!value) return null;
        const days = parseInt(value);
        if (isNaN(days) || days < 0 || days > 365) {
          return 'Payment term must be between 0 and 365 days';
        }
        return null;
      },
    },
  });

  // Load customer data when available
  useEffect(() => {
    if (customer) {
      form.setValues({
        customerName: customer.customerName,
        customerType: customer.customerType,
        vstnBranchId: customer.vstnBranchId,
        partnerId: customer.partnerId,
        currencyCode: customer.currencyCode,
        pan: customer.pan || '',
        gstin: customer.gstin || '',
        tan: customer.tan || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.addresses?.[0]?.addressLine1 || '',
        city: customer.addresses?.[0]?.city || '',
        state: customer.addresses?.[0]?.state || '',
        pincode: customer.addresses?.[0]?.postalCode || '',
        country: customer.addresses?.[0]?.country || 'IN',
        webUrl: customer.webUrl || '',
        paymentTerm: customer.paymentTerm || '',
        customerDescription: customer.customerDescription || '',
        industry: customer.industry || '',
        customerSegment: customer.customerSegment || '',
        onboardedDate: customer.onboardedDate ? new Date(customer.onboardedDate) : undefined,
        contacts: customer.contacts?.map(contact => ({
          name: contact.name,
          designation: contact.designation || '',
          email: contact.email || '',
          phone: contact.phone || '',
          isPrimary: contact.isPrimary || false,
        })) || [],
      });
      form.resetDirty();
    }
  }, [customer]);

  // Track form changes
  useEffect(() => {
    const isDirty = form.isDirty();
    setHasUnsavedChanges(isDirty);
  }, [form.values]);

  const handleSubmit = (values: CustomerFormValues) => {
    // Convert single address fields to addresses array
    const addresses: AddressFormData[] = [];
    if (values.address || values.city || values.state || values.pincode) {
      addresses.push({
        addressLine1: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.pincode,
        country: values.country || 'IN',
        isPrimary: true,
        isBilling: true,
        isShipping: true,
      });
    }

    // Convert contacts to proper format
    const contacts: ContactPersonFormData[] = values.contacts?.filter(c => c.name) || [];

    const customerData: CustomerFormData = {
      customerName: values.customerName,
      customerType: values.customerType,
      vstnBranchId: values.vstnBranchId,
      partnerId: values.partnerId,
      currencyCode: values.currencyCode,
      pan: values.pan || undefined,
      gstin: values.gstin || undefined,
      tan: values.tan || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      webUrl: values.webUrl || undefined,
      paymentTerm: values.paymentTerm || undefined,
      customerDescription: values.customerDescription || undefined,
      industry: values.industry || undefined,
      customerSegment: values.customerSegment || undefined,
      onboardedDate: values.onboardedDate || undefined,
      addresses: addresses.length > 0 ? addresses : undefined,
      contacts: contacts.length > 0 ? contacts : undefined,
    };

    updateMutation.mutate(
      { id: customerId, data: customerData },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Success',
            message: 'Customer updated successfully',
            color: 'green',
          });
          form.resetDirty();
          setHasUnsavedChanges(false);
          navigate(`/customers/${customerId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error || !customer) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        {error?.message || 'Customer not found'}
      </Alert>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xl">
        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between" align="center" mb="xl">
            <Group>
              <Title order={2}>Edit Customer</Title>
              {hasUnsavedChanges && (
                <Badge color="yellow" variant="light">
                  Unsaved changes
                </Badge>
              )}
            </Group>
            <Group>
              <Button
                variant="subtle"
                leftSection={<IconX size={16} />}
                onClick={() => navigate(`/customers/${customerId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateMutation.isPending}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                Save Changes
              </Button>
            </Group>
          </Group>

          <CustomerFormComponent form={form} mode="edit" />
        </Paper>
      </Stack>
    </form>
  );
}