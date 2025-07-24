import { UseFormReturnType } from '@mantine/form';
import { Stack, Textarea, Card, Text, Group, Select } from '@mantine/core';

interface TermsAndBillingStepProps {
  form: UseFormReturnType<any>;
}

const standardTermsTemplates = [
  {
    value: 'standard',
    label: 'Standard Terms',
    content: `Standard terms and conditions apply.

1. Payment Terms: 50% advance, 50% on completion
2. Service delivery as per agreed timeline
3. Additional services will be charged separately
4. All applicable taxes extra as per actuals
5. Validity of this proposal is 30 days from the date of issue`
  },
  {
    value: 'retainer',
    label: 'Retainer Terms',
    content: `Retainer engagement terms apply.

1. Monthly retainer fee payable in advance
2. Quarterly review and reconciliation
3. Additional services beyond scope charged separately
4. 30 days notice period for termination
5. Annual fee revision based on scope changes`
  },
  {
    value: 'international',
    label: 'International Terms',
    content: `International engagement terms apply.

1. Payment in foreign currency as specified
2. Wire transfer charges borne by client
3. Exchange rate as on date of payment
4. Force majeure and jurisdiction clauses apply
5. Deliverables subject to regulatory approvals`
  }
];

export function TermsAndBillingStep({ form }: TermsAndBillingStepProps) {
  const handleTemplateSelect = (templateValue: string | null) => {
    if (!templateValue) return;
    
    const template = standardTermsTemplates.find(t => t.value === templateValue);
    if (template) {
      form.setFieldValue('terms_and_conditions', template.content);
    }
  };

  return (
    <Stack gap="md" mt="xl">
      {/* Terms & Conditions */}
      <Card withBorder>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={500}>Terms & Conditions</Text>
            <Select
              placeholder="Load template"
              data={standardTermsTemplates.map(t => ({ value: t.value, label: t.label }))}
              onChange={handleTemplateSelect}
              size="xs"
              style={{ width: 200 }}
              clearable
            />
          </Group>
          
          <Textarea
            placeholder="Enter terms and conditions"
            value={form.values.terms_and_conditions || ''}
            onChange={(e) => form.setFieldValue('terms_and_conditions', e.currentTarget.value)}
            minRows={8}
            autosize
          />
        </Stack>
      </Card>

      {/* Additional Clauses (if needed) */}
      <Card withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={500}>Additional Clauses (Optional)</Text>
          <Textarea
            placeholder="Enter any additional clauses or exclusions"
            value={form.values.additional_clauses || ''}
            onChange={(e) => form.setFieldValue('additional_clauses', e.currentTarget.value)}
            minRows={4}
            description="Add any specific exclusions, assumptions, or special conditions"
          />
        </Stack>
      </Card>
    </Stack>
  );
}