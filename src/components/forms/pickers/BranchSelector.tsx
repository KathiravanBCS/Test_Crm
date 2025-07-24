import { Select, type SelectProps } from '@mantine/core';
import { useGetBranches } from '@/lib/hooks/useGetBranches';

interface BranchSelectorProps extends Omit<SelectProps, 'data'> {
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function BranchSelector({
  label = 'Branch',
  placeholder = 'Select branch',
  required = false,
  ...props
}: BranchSelectorProps) {
  const { data: branches = [], isLoading } = useGetBranches();

  const branchOptions = branches
    .filter(branch => branch.isActive)
    .map(branch => ({
      value: String(branch.id),
      label: `${branch.branchName} (${branch.country})`
    }));

  return (
    <Select
      label={label}
      placeholder={placeholder}
      required={required}
      data={branchOptions}
      disabled={isLoading}   
      {...props}
    />
  );
}