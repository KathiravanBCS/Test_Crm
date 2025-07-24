import { Anchor } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbLinkProps {
  to: string;
  children: React.ReactNode;
}

export function BreadcrumbLink({ to, children }: BreadcrumbLinkProps) {
  const navigate = useNavigate();
  
  return (
    <Anchor 
      component="button" 
      onClick={() => navigate(to)}
      style={{ background: 'none', border: 'none', padding: 0 }}
    >
      {children}
    </Anchor>
  );
}