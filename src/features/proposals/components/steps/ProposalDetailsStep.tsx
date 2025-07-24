import { UseFormReturnType } from '@mantine/form';
import { Stack, TextInput, Textarea, Group } from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { EmployeePicker } from '@/components/forms/pickers/EmployeePicker';

interface ProposalDetailsStepProps {
  form: UseFormReturnType<any>;
}

export function ProposalDetailsStep({ form }: ProposalDetailsStepProps) {
  // Auto-suggest proposal name based on customer and services
  const suggestProposalName = () => {
    if (!form.values.customer) return '';
    
    const customerName = form.values.customer.name;
    const year = new Date().getFullYear();
    
    return `Tax Services for ${customerName} - FY ${year}-${(year + 1).toString().slice(-2)}`;
  };

  const handleAssignedToChange = (employeeIds: number[]) => {
    form.setFieldValue('assigned_to', employeeIds);
  };

  return (
    <Stack gap="md" mt="xl">
      <TextInput
        label="Proposal Name"
        placeholder={suggestProposalName() || "Enter proposal name"}
        value={form.values.proposal_name || ''}
        onChange={(e) => form.setFieldValue('proposal_name', e.currentTarget.value)}
        error={form.errors.proposal_name}
        description="A descriptive name for this proposal"
        required
      />

      <Group grow>
        <DateField
          label="Proposal Date"
          placeholder="Select proposal date"
          value={form.values.proposal_date}
          onChange={(value) => form.setFieldValue('proposal_date', value)}
          required
        />

        <DateField
          label="Valid Until"
          placeholder="Select valid until date"
          value={form.values.valid_until}
          onChange={(value) => form.setFieldValue('valid_until', value)}
          minDate={form.values.proposal_date ? new Date(form.values.proposal_date) : new Date()}
          required
        />
      </Group>

      <EmployeePicker
        label="Assigned To"
        placeholder="Search employees by name or email..."
        value={form.values.assigned_to || []}
        onChange={handleAssignedToChange}
        multiple
        description="Select one or more employees who will follow up on this proposal"
      />

      <DateField
        label="Next Follow-up Date (Optional)"
        placeholder="Select follow-up date"
        value={form.values.next_follow_up_date}
        onChange={(value) => form.setFieldValue('next_follow_up_date', value)}
        minDate={new Date()}
        description="Set a reminder for following up on this proposal"
      />

      <Textarea
        label="Internal Notes (Optional)"
        placeholder="Any internal notes or special considerations for this proposal"
        value={form.values.notes || ''}
        onChange={(e) => form.setFieldValue('notes', e.currentTarget.value)}
        minRows={3}
        description="These notes are for internal use only and won't be included in the proposal"
      />
    </Stack>
  );
}