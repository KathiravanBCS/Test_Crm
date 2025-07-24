import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Group, Title, Paper } from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { validatePAN } from '@/lib/utils/validators';
import { validateGSTIN } from '@/components/forms/inputs/GstinInput';
import { CustomerFormComponent, type CustomerFormValues } from './CustomerFormComponent';
import { useCreateCustomer } from '../api/useCreateCustomer';
import type { CustomerFormData } from '../types';
import type { AddressFormData, ContactPersonFormData } from '@/types/common';

export function CustomerCreateForm() {
  const navigate = useNavigate();
  const createMutation = useCreateCustomer();

  const form = useForm<CustomerFormValues>({
    mode: 'uncontrolled',
    validateInputOnChange: false,
    validateInputOnBlur: true,
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
      contacts: [
        {
          name: '',
          designation: '',
          email: '',
          phone: '',
          isPrimary: true,
        },
      ],
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
        return validatePAN(value) ? null : 'Invalid PAN format (e.g., ABCDE1234F)';
      },
      gstin: (value) => {
        if (!value) return null;
        return validateGSTIN(value) || null;
      },
      tan: (value) => {
        if (!value) return null;
        const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
        return tanRegex.test(value) ? null : 'Invalid TAN format (e.g., ABCD12345E)';
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
      contacts: {
        name: (value, values, path) => {
          const index = parseInt(path.split('.')[1]);
          return !values.contacts?.[index]?.name ? 'Contact name is required' : null;
        },
        email: (value, values, path) => {
          const index = parseInt(path.split('.')[1]);
          const email = values.contacts?.[index]?.email;
          if (!email) return null;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email) ? null : 'Invalid email format';
        },
        phone: (value, values, path) => {
          const index = parseInt(path.split('.')[1]);
          const phone = values.contacts?.[index]?.phone;
          if (!phone) return null;
          const phoneRegex = /^[6-9]\d{9}$/;
          return phoneRegex.test(phone.replace(/\D/g, '')) ? null : 'Invalid phone number';
        },
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

  const handleSubmit = form.onSubmit(
    async (values) => {
      console.log('Form submitted with values:', values);
      try {
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

      const newCustomer = await createMutation.mutateAsync(customerData);
      
      notifications.show({
        title: 'Success',
        message: 'Customer created successfully',
        color: 'green',
      });
      
      navigate(`/customers/${newCustomer.id}`);
    } catch (error) {
      console.error('Error creating customer:', error);
      // Error is handled by the mutation
    }
  },
  (errors) => {
    console.log('Form validation failed:', errors);
    notifications.show({
      title: 'Validation Error',
      message: 'Please fix the errors in the form',
      color: 'red',
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between" align="center" mb="xl">
            <Title order={2}>Create New Customer</Title>
            <Group>
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/customers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending}
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={() => {
                  console.log('Button clicked');
                  console.log('Form values:', form.getValues());
                  console.log('Form errors:', form.errors);
                  console.log('Form is valid:', form.isValid());
                }}
              >
                Create Customer
              </Button>
            </Group>
          </Group>

          <CustomerFormComponent form={form} mode="create" />
        </Paper>
      </Stack>
    </form>
  );
}