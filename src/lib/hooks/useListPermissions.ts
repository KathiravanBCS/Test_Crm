import { useAbility } from '@/lib/casl/AbilityContext';
import type { Subjects } from '@/lib/casl/types';

interface ListPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canBulkAction: boolean;
}

export function useListPermissions(entityType: Subjects | string): ListPermissions {
  const { ability } = useAbility();
  
  return {
    canView: ability.can('read', entityType as Subjects),
    canCreate: ability.can('create', entityType as Subjects),
    canEdit: ability.can('update', entityType as Subjects),
    canDelete: ability.can('delete', entityType as Subjects),
    canBulkAction: ability.can('delete', entityType as Subjects), // Usually same as delete permission
  };
}