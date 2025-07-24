import { useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  Avatar,
  Group,
  UnstyledButton,
  ScrollArea,
  Divider,
  NavLink,
  Tooltip,
  Menu,
  useMantineTheme
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconUsers,
  IconSettings,
  IconClipboardCheck,
  IconChevronDown,
  IconHelp,
  IconFileInvoice,
  IconFiles,
  IconChartBar,
  IconBriefcase,
  IconMenu2,
  IconLayoutSidebar,
  IconUsersGroup,
  IconFileText,
  IconUser,
  IconLogout,
  IconSwitchHorizontal,
  IconUserCircle,
  IconCalendarEvent,
  IconSitemap,
  IconPackage,
  IconApi,
  IconMail
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import vstnLogo from '@/assets/vstn-logo.png';

interface NavItem {
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  path?: string;
  badge?: string | number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface TaskStats {
  pendingTasks?: number;
}

// This will be updated with dynamic badges
const getNavSections = (taskStats?: TaskStats): NavSection[] => [
  {
    items: [
      { icon: IconLayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ]
  },
  {
    title: 'Workflow',
    items: [
      { icon: IconUsersGroup, label: 'Partners', path: '/partners' },
      { icon: IconUsers, label: 'Customers', path: '/customers' },
      { icon: IconFileInvoice, label: 'Proposals', path: '/proposals' },
      {
        icon: IconFileText,
        label: 'Engagement Letters',
        path: '/engagement-letters',
      },
      {
        icon: IconBriefcase,
        label: 'Engagements',
        path: '/engagements',
      },
      { icon: IconFiles, label: 'Documents', path: '/documents' },
      { icon: IconClipboardCheck, label: 'Tasks', path: '/tasks', badge: taskStats?.pendingTasks || undefined },
    ]
  },
  {
    title: 'Workforce',
    items: [
      { icon: IconUsers, label: 'Employee Directory', path: '/employees' },
      { icon: IconUserCircle, label: 'My Profile', path: '/my-profile' },
      { icon: IconCalendarEvent, label: 'Leave Calendar', path: '/leaves' },
      { icon: IconSitemap, label: 'Org Structure', path: '/org-chart' },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { icon: IconChartBar, label: 'Reports', path: '/reports' },
    ]
  },
  {
    title: 'System',
    items: [
      { icon: IconPackage, label: 'Service Items', path: '/service-items' },
      { icon: IconSettings, label: 'Settings', path: '/settings' },
      { icon: IconApi, label: 'Graph API Test', path: '/graph-api-test' },
      { icon: IconMail, label: 'Outlook Test', path: '/outlook-test' },
      { icon: IconHelp, label: 'Help Center' },
    ]
  },
];

interface SidebarProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

// Simplified NavItem component
function NavItemComponent({ item, isActive, isCollapsed, onNavigate }: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: (path?: string) => void;
}) {
  const theme = useMantineTheme();
  const IconComponent = item.icon;
  
  const navLink = (
    <NavLink
      href="#"
      label={!isCollapsed ? item.label : undefined}
      leftSection={<IconComponent size={20} stroke={1.5} />}
      rightSection={
        !isCollapsed && item.badge ? (
          <Badge size="xs" variant="filled" color="red">
            {item.badge}
          </Badge>
        ) : undefined
      }
      active={isActive}
      style={{
        paddingTop: '0.5rem',
        paddingRight: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: isActive ? '0.75rem' : '0.5rem',
        borderRadius: '0.375rem',
        marginBottom: '0.5rem',       
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderLeft: isActive ? `3px solid ${theme.colors[theme.primaryColor][6]}` : '3px solid transparent',
      }}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(item.path);
      }}
    />
  );

  if (isCollapsed) {
    return (
      <Tooltip
        label={
          <div>
            <div>{item.label}</div>
            {item.badge && (
              <Badge size="xs" variant="filled" color="red" mt={4}>
                {item.badge}
              </Badge>
            )}
          </div>
        }
        position="right"
        withArrow
        offset={10}
      >
        <div>{navLink}</div>
      </Tooltip>
    );
  }

  return navLink;
}

export function Sidebar({ onToggle, isCollapsed: externalCollapsed }: SidebarProps) {
  const theme = useMantineTheme();
  const [internalCollapsed, { toggle: toggleInternal }] = useDisclosure();
  const isNavCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleNav = onToggle || toggleInternal;
  const navigate = useNavigate();
  const location = useLocation();
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  

  // Get stats for badges (placeholder for now)
  const taskStats = { pendingTasks: 5 }; // TODO: Replace with actual task stats

  // Get nav sections with dynamic badges
  const navSections = getNavSections(taskStats);

  const handleNavigation = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error('Logout failed:', e);
    });
  };

  const getUserInitials = () => {
    if (!account) return 'U';
    const name = account.name || account.username;
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getUserName = () => {
    if (!account) return 'User';
    return account.name || account.username || 'User';
  };

  const getUserEmail = () => {
    if (!account) return '';
    return account.username || '';
  };

  return (
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Collapsible Header */}
      <Box
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        {!isNavCollapsed ? (
          <Group gap="sm">
            <Avatar
              size={36}
              radius="md"
              src={vstnLogo}
              alt="VSTN Logo"
            />
            <Box>
              <Text fw={700} size="lg" c="gray.9">
                VSTN CRM
              </Text>
              <Text size="xs" c="gray.6">
                CRM Portal
              </Text>
            </Box>
          </Group>
        ) : (
          <Avatar
            size={32}
            radius="md"
            src={vstnLogo}
            alt="VSTN Logo"
          />
        )}
        <Tooltip
          label={isNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          position="right"
          withArrow
        >
          <UnstyledButton
            onClick={toggleNav}
            style={{
              padding: '0.25rem',
              borderRadius: '0.375rem',
              color: '#64748b',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
            }}
          >
            {isNavCollapsed ? (
              <IconMenu2 size={20} />
            ) : (
              <IconLayoutSidebar size={20} />
            )}
          </UnstyledButton>
        </Tooltip>
      </Box>

      {/* Navigation */}
      <ScrollArea style={{ flex: 1 }}>
        <div style={{ padding: '0.5rem' }}>
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '1.5rem' }}>
              {/* Section Title */}
              {section.title && !isNavCollapsed && (
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={600}
                  c="gray.6"
                  style={{
                    padding: '0.5rem 0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {section.title}
                </Text>
              )}
              
              {/* Section Items */}
              <div>
                {section.items.map((item, itemIndex) => {
                  // For hash routing, we need to check the hash part of the URL
                  // location.hash will be like "#/partners" so we remove the # prefix
                  const currentPath = location.hash.slice(1) || location.pathname;
                  const isActive = Boolean(
                    item.path && 
                    (currentPath === item.path || currentPath.startsWith(item.path + '/'))
                  );
                  
                  return (
                    <NavItemComponent
                      key={itemIndex}
                      item={item}
                      isActive={isActive}
                      isCollapsed={isNavCollapsed}
                      onNavigate={handleNavigation}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <Box style={{ padding: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
        <Divider style={{ marginBottom: '0.5rem' }} />
        <Menu shadow="md" width={200} position="top" offset={5}>
          <Menu.Target>
            <UnstyledButton
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'background-color 150ms ease',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              {!isNavCollapsed ? (
                <Group gap="sm">
                  <Avatar
                    size={40}
                    radius="xl"
                    color={theme.primaryColor}
                    variant="filled"
                  >
                    {getUserInitials()}
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500} c="gray.9" truncate>
                      {getUserName()}
                    </Text>
                    <Text size="xs" c="gray.6" truncate>
                      {getUserEmail()}
                    </Text>
                  </Box>
                  <IconChevronDown size={14} style={{ color: '#64748b' }} />
                </Group>
              ) : (
                <Tooltip
                  label={
                    <div>
                      <div>{getUserName()}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>
                        {getUserEmail()}
                      </div>
                    </div>
                  }
                  position="right"
                  withArrow
                  offset={10}
                >
                  <Avatar
                    size={36}
                    radius="xl"
                    color={theme.primaryColor}
                    variant="filled"
                    style={{ margin: isNavCollapsed ? '0 auto' : 0 }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </Tooltip>
              )}
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item 
              leftSection={<IconUser size={14} />}
              onClick={() => navigate('/my-profile')}
            >
              View Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />}>
              Settings
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item leftSection={<IconSwitchHorizontal size={14} />}>
              Switch User
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout size={14} />}
              color="red"
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Box>
  );
}