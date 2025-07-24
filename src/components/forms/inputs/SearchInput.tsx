import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebouncedValue(localValue, debounce);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <TextInput
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      value={localValue}
      onChange={(e) => setLocalValue(e.currentTarget.value)}
      rightSection={
        localValue && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => {
              setLocalValue('');
              onChange('');
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        )
      }
      styles={{ root: { flexGrow: 1 } }}
    />
  );
}