import React, { useState, useMemo, useCallback } from 'react';
import { Select, MultiSelect, Avatar, Group, Text } from '@mantine/core';
import type { SelectProps, MultiSelectProps } from '@mantine/core';
import { IconUserSearch } from '@tabler/icons-react';
import { useGetEmployees } from '@/lib/hooks/useGetEmployees';
import type { EmployeeProfile, EmployeeRole } from '@/types/common';

interface BaseEmployeePickerProps {
  roleFilter?: EmployeeRole | EmployeeRole[];
  excludeInactive?: boolean;
  excludeIds?: number[];
}

interface SingleEmployeePickerProps extends BaseEmployeePickerProps, Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  multiple?: false;
  value?: number | null;
  onChange?: (value: number | null) => void;
}

interface MultiEmployeePickerProps extends BaseEmployeePickerProps, Omit<MultiSelectProps, 'data' | 'value' | 'onChange'> {
  multiple: true;
  value?: number[];
  onChange?: (value: number[]) => void;
}

type EmployeePickerProps = SingleEmployeePickerProps | MultiEmployeePickerProps;

interface EmployeeOption {
  value: string;
  label: string;
  employee: EmployeeProfile;
}

export function EmployeePicker(props: EmployeePickerProps) {
  const {
    multiple = false,
    value,
    onChange,
    roleFilter,
    excludeInactive = true,
    excludeIds = [],
    label = multiple ? 'Employees' : 'Employee',
    placeholder = multiple ? 'Select employees...' : 'Select employee...',
    required = false,
    disabled = false,
    error,
    ...restProps
  } = props;

  // State for search
  const [searchValue, setSearchValue] = useState('');

  // Fetch employees from local database
  const { data: dbEmployees = [], isLoading } = useGetEmployees();

  // Filter employees based on props
  const filterEmployees = useCallback((employees: EmployeeProfile[]) => {
    return employees.filter(employee => {
      // Filter by active status
      if (excludeInactive && employee.isActive === false) return false;
      
      // Filter by role
      if (roleFilter) {
        const roles = Array.isArray(roleFilter) ? roleFilter : [roleFilter];
        if (!roles.includes(employee.role as EmployeeRole)) return false;
      }
      
      // Exclude specific IDs
      if (excludeIds.includes(employee.id)) return false;
      
      return true;
    });
  }, [excludeInactive, roleFilter, excludeIds]);

  // Filter and prepare employee options
  const employeeOptions = useMemo((): EmployeeOption[] => {
    // Filter employees based on props
    const filteredEmployees = filterEmployees(dbEmployees);
    
    // Convert to options format
    const options = filteredEmployees.map(emp => ({
      value: String(emp.id),
      label: emp.name,
      employee: emp
    }));

    // Filter by search value
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return options.filter(opt => 
        opt.employee.name.toLowerCase().includes(searchLower) ||
        opt.employee.email.toLowerCase().includes(searchLower)
      );
    }

    return options;
  }, [dbEmployees, filterEmployees, searchValue]);

  // Custom render option for Mantine v8
  const renderOption: SelectProps['renderOption'] = ({ option }) => {
    const employeeOption = employeeOptions.find(e => e.value === option.value);
    if (!employeeOption) return <Text size="sm">{option.label}</Text>;
    
    const { employee } = employeeOption;
    
    return (
      <Group wrap="nowrap">
        <Avatar size="sm" radius="xl" color="grape">
          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm">{employee.name}</Text>
          <Text size="xs" c="dimmed">
            {employee.position || employee.role} • {employee.email}
          </Text>
        </div>
      </Group>
    );
  };

  // Handle value changes
  const handleChange = useCallback((selectedValues: string | string[] | null) => {
    if (!onChange) return;

    if (multiple) {
      const values = selectedValues as string[];
      const selectedIds = values.map(val => Number(val));
      (onChange as (value: number[]) => void)(selectedIds);
    } else {
      const val = selectedValues as string | null;
      (onChange as (value: number | null) => void)(val ? Number(val) : null);
    }
  }, [onChange, multiple]);

  // Prepare data for Select/MultiSelect
  const selectData = employeeOptions.map(opt => ({
    value: opt.value,
    label: opt.label,
  }));


  if (multiple) {
    return (
      <MultiSelect
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled || isLoading}
        error={error}
        data={selectData}
        value={(value as number[] | undefined)?.map(v => String(v)) || []}
        onChange={handleChange}
        renderOption={renderOption}
        searchable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        clearable
        maxDropdownHeight={280}
        leftSection={<IconUserSearch size={16} />}
        {...(restProps as MultiSelectProps)}
      />
    );
  }

  return (
    <Select
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled || isLoading}
      error={error}
      data={selectData}
      value={(value as number | null | undefined) ? String(value) : null}
      onChange={handleChange}
      renderOption={renderOption}
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      clearable
      maxDropdownHeight={280}
      leftSection={<IconUserSearch size={16} />}
      {...(restProps as SelectProps)}
    />
  );
}