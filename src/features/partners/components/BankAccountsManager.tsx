import { useState } from 'react';
import {
  Stack,
  Card,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  ActionIcon,
  Text,
  Badge,
  Divider,
  Alert,
} from '@mantine/core';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconBuildingBank } from '@tabler/icons-react';
import type { PartnerBankAccount } from '../types';

interface BankAccountsManagerProps {
  bankAccounts: Omit<PartnerBankAccount, 'id' | 'partnerId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted'>[];
  onUpdate: (bankAccounts: Omit<PartnerBankAccount, 'id' | 'partnerId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted'>[]) => void;
}

export function BankAccountsManager({ bankAccounts, onUpdate }: BankAccountsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PartnerBankAccount>>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: 'current',
    currencyCode: 'INR',
    swiftCode: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setFormData({
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountType: 'current',
      currencyCode: 'INR',
      swiftCode: '',
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
    setFormData({ ...bankAccounts[index] });
  };

  const handleSave = () => {
    if (!formData.accountHolderName || !formData.accountNumber) {
      return;
    }

    const newAccount = {
      accountHolderName: formData.accountHolderName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      bankName: formData.bankName,
      accountType: formData.accountType as 'savings' | 'current' | 'fixed_deposit',
      currencyCode: formData.currencyCode || 'INR',
      swiftCode: formData.swiftCode,
    };

    if (isAdding) {
      onUpdate([...bankAccounts, newAccount]);
    } else if (editingIndex !== null) {
      const updated = [...bankAccounts];
      updated[editingIndex] = newAccount;
      onUpdate(updated);
    }

    setIsAdding(false);
    setEditingIndex(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({});
  };

  const handleDelete = (index: number) => {
    const updated = bankAccounts.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const isFormValid = formData.accountHolderName && formData.accountNumber;

  return (
    <Stack gap="md">
      {bankAccounts.length === 0 && !isAdding && (
        <Alert color="yellow" variant="light" icon={<IconBuildingBank size={16} />}>
          No bank accounts added. Add at least one bank account for commission payments.
        </Alert>
      )}

      {bankAccounts.map((account, index) => (
        <Card key={index} withBorder p="md">
          {editingIndex === index ? (
            <Stack gap="md">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Account Holder Name"
                    placeholder="Enter account holder name"
                    required
                    value={formData.accountHolderName || ''}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Account Number"
                    placeholder="Enter account number"
                    required
                    value={formData.accountNumber || ''}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </Grid.Col>
              </Grid>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Select
                    label="Account Type"
                    data={[
                      { value: 'savings', label: 'Savings' },
                      { value: 'current', label: 'Current' },
                      { value: 'fixed_deposit', label: 'Fixed Deposit' },
                    ]}
                    value={formData.accountType || 'current'}
                    onChange={(value) => setFormData({ ...formData, accountType: value as any })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <TextInput
                    label="Bank Name"
                    placeholder="Enter bank name"
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Select
                    label="Currency"
                    data={[
                      { value: 'INR', label: 'INR' },
                      { value: 'USD', label: 'USD' },
                      { value: 'AED', label: 'AED' },
                    ]}
                    value={formData.currencyCode || 'INR'}
                    onChange={(value) => setFormData({ ...formData, currencyCode: value || 'INR' })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  {formData.currencyCode === 'INR' ? (
                    <TextInput
                      label="IFSC Code"
                      placeholder="ABCD0123456"
                      styles={{ input: { textTransform: 'uppercase' } }}
                      value={formData.ifscCode || ''}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    />
                  ) : (
                    <TextInput
                      label="SWIFT Code"
                      placeholder="ABCDEFGH"
                      styles={{ input: { textTransform: 'uppercase' } }}
                      value={formData.swiftCode || ''}
                      onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value.toUpperCase() })}
                    />
                  )}
                </Grid.Col>
              </Grid>

              <Group justify="flex-end">
                <Button variant="light" size="xs" onClick={handleCancel} leftSection={<IconX size={16} />}>
                  Cancel
                </Button>
                <Button size="xs" onClick={handleSave} disabled={!isFormValid} leftSection={<IconCheck size={16} />}>
                  Save
                </Button>
              </Group>
            </Stack>
          ) : (
            <Group justify="space-between">
              <div style={{ flex: 1 }}>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{account.accountHolderName}</Text>
                  <Badge color="blue" variant="light" size="sm">
                    {account.accountType}
                  </Badge>
                </Group>
                <Group gap="lg">
                  <Text size="sm" c="dimmed">
                    Account: {account.accountNumber}
                  </Text>
                  {account.bankName && (
                    <Text size="sm" c="dimmed">
                      Bank: {account.bankName}
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    {account.currencyCode}
                  </Text>
                  {account.ifscCode && (
                    <Text size="sm" c="dimmed">
                      IFSC: {account.ifscCode}
                    </Text>
                  )}
                  {account.swiftCode && (
                    <Text size="sm" c="dimmed">
                      SWIFT: {account.swiftCode}
                    </Text>
                  )}
                </Group>
              </div>
              <Group gap="xs">
                <ActionIcon variant="light" onClick={() => handleEdit(index)}>
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon variant="light" color="red" onClick={() => handleDelete(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          )}
        </Card>
      ))}

      {isAdding && (
        <Card withBorder p="md">
          <Stack gap="md">
            <Text fw={500}>Add New Bank Account</Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Account Holder Name"
                  placeholder="Enter account holder name"
                  required
                  value={formData.accountHolderName || ''}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Account Number"
                  placeholder="Enter account number"
                  required
                  value={formData.accountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 3 }}>
                <Select
                  label="Account Type"
                  data={[
                    { value: 'savings', label: 'Savings' },
                    { value: 'current', label: 'Current' },
                    { value: 'fixed_deposit', label: 'Fixed Deposit' },
                  ]}
                  value={formData.accountType || 'current'}
                  onChange={(value) => setFormData({ ...formData, accountType: value as any })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 3 }}>
                <TextInput
                  label="Bank Name"
                  placeholder="Enter bank name"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 3 }}>
                <Select
                  label="Currency"
                  data={[
                    { value: 'INR', label: 'INR' },
                    { value: 'USD', label: 'USD' },
                    { value: 'AED', label: 'AED' },
                  ]}
                  value={formData.currencyCode || 'INR'}
                  onChange={(value) => setFormData({ ...formData, currencyCode: value || 'INR' })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 3 }}>
                {formData.currencyCode === 'INR' ? (
                  <TextInput
                    label="IFSC Code"
                    placeholder="ABCD0123456"
                    styles={{ input: { textTransform: 'uppercase' } }}
                    value={formData.ifscCode || ''}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  />
                ) : (
                  <TextInput
                    label="SWIFT Code"
                    placeholder="ABCDEFGH"
                    styles={{ input: { textTransform: 'uppercase' } }}
                    value={formData.swiftCode || ''}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value.toUpperCase() })}
                  />
                )}
              </Grid.Col>
            </Grid>

            <Group justify="flex-end">
              <Button variant="light" size="xs" onClick={handleCancel} leftSection={<IconX size={16} />}>
                Cancel
              </Button>
              <Button size="xs" onClick={handleSave} disabled={!isFormValid} leftSection={<IconCheck size={16} />}>
                Save
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {!isAdding && (
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={handleAdd}
          fullWidth
        >
          Add Bank Account
        </Button>
      )}
    </Stack>
  );
}