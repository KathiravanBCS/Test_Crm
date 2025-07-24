import { useState } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Switch,
  Button,
  Group,
  Text,
  Alert,
  Radio,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconShare, IconInfoCircle, IconMail } from '@tabler/icons-react';
import { DateTimeField } from '@/components/forms/inputs/DateTimeField';
import { useShareDocument } from '../api/useShareDocument';
import { DocumentMetadata } from '../types';
import { useGetEmployees } from '@/features/employees/api/useGetEmployees';

interface DocumentShareModalProps {
  document: DocumentMetadata;
  onSuccess: () => void;
}

interface FormValues {
  recipients: string[];
  customEmails: string;
  message: string;
  permission: 'read' | 'write';
  requireSignIn: boolean;
  sendInvitation: boolean;
  expirationDate: Date | null;
}

export function DocumentShareModal({ document, onSuccess }: DocumentShareModalProps) {
  const shareMutation = useShareDocument();
  const { data: employees } = useGetEmployees();

  const form = useForm<FormValues>({
    initialValues: {
      recipients: [],
      customEmails: '',
      message: '',
      permission: 'read',
      requireSignIn: true,
      sendInvitation: true,
      expirationDate: null,
    },
    validate: {
      recipients: (value, values) => {
        if (value.length === 0 && !values.customEmails) {
          return 'Please select at least one recipient or enter email addresses';
        }
        return null;
      },
      customEmails: (value) => {
        if (value) {
          const emails = value.split(',').map(e => e.trim());
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const invalidEmails = emails.filter(email => !emailRegex.test(email));
          if (invalidEmails.length > 0) {
            return `Invalid email(s): ${invalidEmails.join(', ')}`;
          }
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const allRecipients = [...values.recipients];
    
    if (values.customEmails) {
      const customEmails = values.customEmails.split(',').map(e => e.trim());
      allRecipients.push(...customEmails);
    }

    await shareMutation.mutateAsync({
      documentId: document.sharepointItemId,
      recipients: allRecipients,
      message: values.message,
      requireSignIn: values.requireSignIn,
      sendInvitation: values.sendInvitation,
      roles: [values.permission],
      expirationDateTime: values.expirationDate?.toISOString(),
    });

    onSuccess();
  };

  const employeeOptions = employees?.map(emp => ({
    value: emp.email,
    label: `${emp.firstName} ${emp.lastName} (${emp.email})`,
  })) || [];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Alert icon={<IconInfoCircle size={16} />} variant="light">
          Share "{document.fileName}" via SharePoint with specific people or groups.
        </Alert>

        <MultiSelect
          label="Select Recipients"
          placeholder="Choose employees"
          data={employeeOptions}
          searchable
          {...form.getInputProps('recipients')}
        />

        <TextInput
          label="Additional Email Addresses"
          placeholder="email1@example.com, email2@example.com"
          description="Enter comma-separated email addresses"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps('customEmails')}
        />

        <Divider />

        <Radio.Group
          label="Permission Level"
          {...form.getInputProps('permission')}
        >
          <Stack gap="xs" mt="xs">
            <Radio value="read" label="View only" />
            <Radio value="write" label="View and edit" />
          </Stack>
        </Radio.Group>

        <DateTimeField
          label="Access Expiration (Optional)"
          placeholder="Select expiration date and time"
          value={form.values.expirationDate}
          onChange={(value) => form.setFieldValue('expirationDate', value)}
          error={form.errors.expirationDate}
          minDate={new Date()}
        />

        <Switch
          label="Require sign-in to access"
          description="Recipients must sign in with their Microsoft account"
          {...form.getInputProps('requireSignIn', { type: 'checkbox' })}
        />

        <Switch
          label="Send email invitation"
          description="Notify recipients via email with the sharing link"
          {...form.getInputProps('sendInvitation', { type: 'checkbox' })}
        />

        <Textarea
          label="Message (Optional)"
          placeholder="Add a message to include in the sharing invitation"
          rows={3}
          {...form.getInputProps('message')}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            leftSection={<IconShare size={16} />}
            loading={shareMutation.isPending}
          >
            Share Document
          </Button>
        </Group>
      </Stack>
    </form>
  );
}