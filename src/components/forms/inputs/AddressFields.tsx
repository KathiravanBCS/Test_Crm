import { Grid, TextInput, Select, Textarea, Combobox, useCombobox } from '@mantine/core';
import { IconMapPin, IconBuilding, IconMap, IconMailbox, IconWorld } from '@tabler/icons-react';
import { COUNTRIES, INDIAN_STATES } from '@/lib/constants/countries';

interface AddressFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // Will be properly typed with UseFormReturnType in actual usage
  prefix?: string; // For nested form fields like 'billing.address'
}

export function AddressFields({ form, prefix = '' }: AddressFieldsProps) {
  const getFieldProps = (fieldName: string) => {
    const fullFieldName = prefix ? `${prefix}.${fieldName}` : fieldName;
    return form.getInputProps(fullFieldName);
  };

  const countryValue = form.values[prefix ? `${prefix}.country` : 'country'] || 'IN';
  const isIndia = countryValue === 'IN';

  // Combobox for state field to allow both selection and free text
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const stateValue = form.values[prefix ? `${prefix}.state` : 'state'] || '';
  const stateOptions = isIndia ? INDIAN_STATES : [];

  return (
    <Grid>
      <Grid.Col span={12}>
        <Textarea
          label="Address"
          placeholder="Enter street address"
          rows={2}
          leftSection={<IconMapPin size={16} />}
          {...getFieldProps('address')}
          description="Street address, building name, etc."
        />
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="City"
          placeholder="Enter city"
          leftSection={<IconBuilding size={16} />}
          {...getFieldProps('city')}
        />
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, sm: 6 }}>
        {isIndia ? (
          <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
              form.setFieldValue(prefix ? `${prefix}.state` : 'state', val);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <TextInput
                label="State/Province"
                placeholder="Select or type state"
                leftSection={<IconMap size={16} />}
                value={stateValue}
                onChange={(event) => {
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  form.setFieldValue(prefix ? `${prefix}.state` : 'state', event.currentTarget.value);
                }}
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                error={form.errors[prefix ? `${prefix}.state` : 'state']}
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {stateOptions
                  .filter((item) => 
                    item.label.toLowerCase().includes(stateValue.toLowerCase()) ||
                    item.value.toLowerCase().includes(stateValue.toLowerCase())
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
            leftSection={<IconMap size={16} />}
            {...getFieldProps('state')}
          />
        )}
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Postal Code"
          placeholder={isIndia ? "6 digit PIN" : "Postal code"}
          leftSection={<IconMailbox size={16} />}
          {...getFieldProps('pincode')}
        />
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Select
          label="Country"
          placeholder="Select country"
          data={COUNTRIES.filter(c => c.value !== 'divider')}
          searchable
          leftSection={<IconWorld size={16} />}
          {...getFieldProps('country')}
        />
      </Grid.Col>
    </Grid>
  );
}