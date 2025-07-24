import { useState } from 'react';
import { 
  Stack, 
  Card, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Button,
  Grid,
  TextInput,
  Select,
  Switch,
  Collapse,
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconMapPin,
  IconChevronDown,
  IconChevronUp,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import type { AddressFormData } from '@/types/common';

interface AddressListManagerProps {
  addresses: AddressFormData[];
  onUpdate: (addresses: AddressFormData[]) => void;
  maxAddresses?: number;
}

const indianStates = [
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Puducherry', label: 'Puducherry' },
];

const countryOptions = [
  { value: 'India', label: 'India' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Canada', label: 'Canada' },
  { value: 'China', label: 'China' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Finland', label: 'Finland' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Iraq', label: 'Iraq' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Israel', label: 'Israel' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Lebanon', label: 'Lebanon' },
  { value: 'Luxembourg', label: 'Luxembourg' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Nepal', label: 'Nepal' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Romania', label: 'Romania' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Taiwan', label: 'Taiwan' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Vietnam', label: 'Vietnam' },
];

export function AddressListManager({ addresses = [], onUpdate, maxAddresses = 3 }: AddressListManagerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isPrimary: false,
    isBilling: false,
    isShipping: false,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isPrimary: addresses.length === 0,
      isBilling: addresses.length === 0,
      isShipping: addresses.length === 0,
    });
  };

  const handleSaveNew = () => {
    if (formData.addressLine1?.trim()) {
      const newAddresses = [...addresses, formData];
      // If this is marked as primary, unset others
      if (formData.isPrimary) {
        newAddresses.forEach((addr, idx) => {
          if (idx !== newAddresses.length - 1) {
            addr.isPrimary = false;
          }
        });
      }
      onUpdate(newAddresses);
      setIsAdding(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
    setFormData({ ...addresses[index] });
  };

  const handleSaveEdit = () => {
    if (formData.addressLine1?.trim() && editingIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = formData;
      // If this is marked as primary, unset others
      if (formData.isPrimary) {
        updatedAddresses.forEach((addr, idx) => {
          if (idx !== editingIndex) {
            addr.isPrimary = false;
          }
        });
      }
      onUpdate(updatedAddresses);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    modals.openConfirmModal({
      title: 'Delete Address',
      children: (
        <Text size="sm">Are you sure you want to delete this address?</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        // If we deleted the primary address, make the first one primary
        if (addresses[index].isPrimary && updatedAddresses.length > 0) {
          updatedAddresses[0].isPrimary = true;
          updatedAddresses[0].isBilling = true;
          updatedAddresses[0].isShipping = true;
        }
        onUpdate(updatedAddresses);
      },
    });
  };

  const AddressFormFields = ({ data, onChange }: { data: AddressFormData; onChange: (data: AddressFormData) => void }) => (
    <Stack gap="md">
      <TextInput
        label="Address Line 1"
        placeholder="Street address, P.O. box"
        required
        value={data.addressLine1 || ''}
        onChange={(e) => onChange({ ...data, addressLine1: e.target.value })}
        error={!data.addressLine1?.trim() && 'Address is required'}
      />
      <TextInput
        label="Address Line 2"
        placeholder="Apartment, suite, floor, etc."
        value={data.addressLine2 || ''}
        onChange={(e) => onChange({ ...data, addressLine2: e.target.value })}
      />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="City"
            placeholder="City"
            value={data.city || ''}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {data.country === 'India' ? (
            <Select
              label="State"
              placeholder="Select state"
              data={indianStates}
              value={data.state || ''}
              onChange={(value) => onChange({ ...data, state: value || '' })}
              searchable
            />
          ) : (
            <TextInput
              label="State/Province"
              placeholder="State or Province"
              value={data.state || ''}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
            />
          )}
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Postal Code"
            placeholder="Postal/ZIP code"
            value={data.postalCode || ''}
            onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select
            label="Country"
            placeholder="Select country"
            data={countryOptions}
            value={data.country || 'India'}
            onChange={(value) => onChange({ ...data, country: value || 'India' })}
            searchable
          />
        </Grid.Col>
      </Grid>
      <Group>
        <Switch
          label="Primary Address"
          checked={data.isPrimary || false}
          onChange={(e) => onChange({ ...data, isPrimary: e.currentTarget.checked })}
        />
        <Switch
          label="Billing Address"
          checked={data.isBilling || false}
          onChange={(e) => onChange({ ...data, isBilling: e.currentTarget.checked })}
        />
        <Switch
          label="Shipping Address"
          checked={data.isShipping || false}
          onChange={(e) => onChange({ ...data, isShipping: e.currentTarget.checked })}
        />
      </Group>
    </Stack>
  );

  if (addresses.length === 0 && !isAdding) {
    return (
      <Card withBorder p="lg" style={{ borderStyle: 'dashed' }}>
        <Stack align="center" gap="sm">
          <IconMapPin size={32} color="gray" />
          <Text c="dimmed" size="sm">No addresses added yet</Text>
          <Button
            size="sm"
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={handleAdd}
          >
            Add Address
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      {addresses.length < maxAddresses && !isAdding && editingIndex === null && (
        <Group justify="flex-end">
          <Button
            size="sm"
            variant="light"
            leftSection={<IconPlus size={14} />}
            onClick={handleAdd}
          >
            Add Address
          </Button>
        </Group>
      )}

      {isAdding && (
        <Card withBorder p="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>New Address</Text>
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setIsAdding(false)}
                >
                  <IconX size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={handleSaveNew}
                  disabled={!formData.addressLine1?.trim()}
                >
                  <IconCheck size={16} />
                </ActionIcon>
              </Group>
            </Group>
            <AddressFormFields data={formData} onChange={setFormData} />
          </Stack>
        </Card>
      )}

      {addresses.map((address, index) => (
        <Card key={index} withBorder p="md">
          {editingIndex === index ? (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>Edit Address</Text>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setEditingIndex(null)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color="blue"
                    onClick={handleSaveEdit}
                    disabled={!formData.addressLine1?.trim()}
                  >
                    <IconCheck size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <AddressFormFields data={formData} onChange={setFormData} />
            </Stack>
          ) : (
            <Stack gap="sm">
              <Group justify="space-between">
                <Group>
                  <IconMapPin size={20} />
                  <Text fw={500}>
                    {address.addressLine1}
                    {address.isPrimary && (
                      <Badge size="xs" variant="light" ml="xs">Primary</Badge>
                    )}
                  </Text>
                </Group>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => handleEdit(index)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(index)}
                    disabled={addresses.length === 1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    {expandedIndex === index ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </ActionIcon>
                </Group>
              </Group>

              <Collapse in={expandedIndex === index}>
                <Stack gap="xs" mt="sm">
                  {address.addressLine2 && <Text size="sm">{address.addressLine2}</Text>}
                  <Text size="sm">
                    {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                  </Text>
                  {address.country && <Text size="sm">{address.country}</Text>}
                  <Group gap="xs" mt="xs">
                    {address.isBilling && <Badge size="xs" variant="light">Billing</Badge>}
                    {address.isShipping && <Badge size="xs" variant="light">Shipping</Badge>}
                  </Group>
                </Stack>
              </Collapse>
            </Stack>
          )}
        </Card>
      ))}
    </Stack>
  );
}