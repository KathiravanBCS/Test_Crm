import { useAbility } from '@/lib/casl/AbilityContext';
import type { Subjects } from '@/lib/casl/types';

interface EntityPermissions {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function useEntityPermissions(entityType: Subjects | string, entity?: any): EntityPermissions {
  const { ability } = useAbility();
  
  return {
    canView: ability.can('read', entity || entityType as Subjects),
    canCreate: ability.can('create', entityType as Subjects),
    canUpdate: ability.can('update', entity || entityType as Subjects),
    canDelete: ability.can('delete', entity || entityType as Subjects),
  };
}