import { useForm } from '@mantine/form';
import {
  TextInput,
  Select,
  Stack,
  Group,
  Button,
  Checkbox,
  SimpleGrid,
  Combobox,
  useCombobox,
} from '@mantine/core';
import { Address } from '@/types/customer';
import { COUNTRIES, INDIAN_STATES } from '@/lib/constants/countries';

interface AddressFormProps {
  address?: Partial<Address>;
  onSubmit: (values: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'entityType' | 'entityId'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({ address, onSubmit, onCancel, isLoading }: AddressFormProps) {
  const form = useForm({
    initialValues: {
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      city: address?.city || '',
      state: address?.state || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'IN',
      isPrimary: address?.isPrimary || false,
      isBilling: address?.isBilling || true,
      isShipping: address?.isShipping || false,
    },
    validate: {
      addressLine1: (value) => !value ? 'Address line 1 is required' : null,
      city: (value) => !value ? 'City is required' : null,
      country: (value) => !value ? 'Country is required' : null,
    },
  });

  const isIndia = form.values.country === 'IN';
  
  // Combobox for state field
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const stateOptions = isIndia ? INDIAN_STATES : [];

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Address Line 1"
          placeholder="Street address, building name"
          required
          {...form.getInputProps('addressLine1')}
        />

        <TextInput
          label="Address Line 2"
          placeholder="Apartment, suite, floor (optional)"
          {...form.getInputProps('addressLine2')}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="City"
            placeholder="Enter city"
            required
            {...form.getInputProps('city')}
          />

          {isIndia ? (
            <Combobox
              store={combobox}
              withinPortal={false}
              onOptionSubmit={(val) => {
                form.setFieldValue('state', val);
                combobox.closeDropdown();
              }}
            >
              <Combobox.Target>
                <TextInput
                  label="State/Province"
                  placeholder="Select or type state"
                  value={form.values.state}
                  onChange={(event) => {
                    combobox.openDropdown();
                    combobox.updateSelectedOptionIndex();
                    form.setFieldValue('state', event.currentTarget.value);
                  }}
                  onClick={() => combobox.openDropdown()}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  error={form.errors.state}
                />
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>
                  {stateOptions
                    .filter((item) => 
                      item.label.toLowerCase().includes(form.values.state.toLowerCase()) ||
                      item.value.toLowerCase().includes(form.values.state.toLowerCase())
                    )
                    .map((item) => (
                      <Combobox.Option value={item.value} key={item.value}>
                        {item.label}
                      </Combobox.Option>
                    ))}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          ) : (
            <TextInput
              label="State/Province"
              placeholder="Enter state or province"
              {...form.getInputProps('state')}
            />
          )}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Postal Code"
            placeholder={isIndia ? '6 digit PIN' : 'Postal code'}
            {...form.getInputProps('postalCode')}
          />

          <Select
            label="Country"
            placeholder="Select country"
            required
            data={COUNTRIES.filter(c => c.value !== 'divider')}
            searchable
            {...form.getInputProps('country')}
          />
        </SimpleGrid>

        <Group>
          <Checkbox
            label="Primary Address"
            {...form.getInputProps('isPrimary', { type: 'checkbox' })}
          />
          <Checkbox
            label="Billing Address"
            {...form.getInputProps('isBilling', { type: 'checkbox' })}
          />
          <Checkbox
            label="Shipping Address"
            {...form.getInputProps('isShipping', { type: 'checkbox' })}
          />
        </Group>

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {address ? 'Update Address' : 'Add Address'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}