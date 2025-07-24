import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/lib/auth/AuthGuard';
import { OutlookInitializer } from '@/features/outlook/components/OutlookInitializer';

export function AppLayout() {
  const [mobileOpened] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AuthGuard>
      <OutlookInitializer />
      <AppShell
        padding="md"
        navbar={{
          width: desktopOpened ? 260 : 80,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened },
        }}
        styles={{
          navbar: {
            transition: 'width 200ms ease',
          },
        }}
      >
        <AppShell.Navbar>
          <Sidebar onToggle={toggleDesktop} isCollapsed={!desktopOpened} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </AuthGuard>
  );
}