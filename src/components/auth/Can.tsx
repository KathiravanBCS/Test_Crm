import { Can as CaslCan } from '@casl/react';
import type { ReactNode } from 'react';
import { useAbility } from '@/lib/casl/AbilityContext';

interface CanProps {
  I: string;
  a: any;
  field?: string;
  not?: boolean;
  passThrough?: boolean;
  children: ReactNode | ((isAllowed: boolean, ability: any) => ReactNode);
}

export function Can(props: CanProps) {
  const { ability } = useAbility();
  return <CaslCan {...props} ability={ability} />;
}