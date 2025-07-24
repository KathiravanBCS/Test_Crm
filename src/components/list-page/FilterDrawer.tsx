import { 
  Drawer, 
  Button, 
  Group, 
  Text, 
  Badge, 
  Stack, 
  Tabs,
  ScrollArea,
  Divider,
  ActionIcon,
  Tooltip,
  Paper
} from '@mantine/core';
import { 
  IconFilter, 
  IconX, 
  IconColumns3, 
  IconAdjustments,
  IconRefresh
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { ColumnSelector, ColumnDefinition } from '@/components/tables/ColumnSelector';

interface FilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  onReset: () => void;
  filterCount: number;
  children: ReactNode;
  // Column management props
  columns?: ColumnDefinition[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columns: string[]) => void;
  onColumnReorder?: (columns: string[]) => void;
  defaultTab?: 'filters' | 'columns';
}

export function FilterDrawer({
  opened,
  onClose,
  onReset,
  filterCount,
  children,
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  onColumnReorder,
  defaultTab = 'filters'
}: FilterDrawerProps) {
  const hasColumnManagement = columns && visibleColumns && onColumnVisibilityChange;
  
  const drawerContent = hasColumnManagement ? (
    <Tabs defaultValue={defaultTab}>
      <Tabs.List>
        <Tabs.Tab 
          value="filters" 
          leftSection={<IconAdjustments size={16} />}
          rightSection={filterCount > 0 && (
            <Badge size="xs" circle variant="filled">
              {filterCount}
            </Badge>
          )}
        >
          Filters
        </Tabs.Tab>
        <Tabs.Tab 
          value="columns" 
          leftSection={<IconColumns3 size={16} />}
        >
          Columns
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="filters" pt="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Apply filters to refine your search
            </Text>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={onReset}
              disabled={filterCount === 0}
            >
              Clear all
            </Button>
          </Group>
          <Divider />
          <ScrollArea.Autosize mah="calc(100vh - 300px)" offsetScrollbars>
            {children}
          </ScrollArea.Autosize>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="columns" pt="md">
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onVisibilityChange={onColumnVisibilityChange}
          onColumnReorder={onColumnReorder}
        />
      </Tabs.Panel>
    </Tabs>
  ) : (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Apply filters to refine your search
        </Text>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconRefresh size={14} />}
          onClick={onReset}
          disabled={filterCount === 0}
        >
          Clear all
        </Button>
      </Group>
      <Divider />
      <ScrollArea.Autosize mah="calc(100vh - 250px)" offsetScrollbars>
        {children}
      </ScrollArea.Autosize>
    </Stack>
  );

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconFilter size={20} />
          <Text fw={600} size="lg">Advanced Options</Text>
          {filterCount > 0 && hasColumnManagement && (
            <Badge size="sm" circle variant="filled">
              {filterCount}
            </Badge>
          )}
        </Group>
      }
      position="right"
      size="md"
      closeButtonProps={{
        size: 'md',
        radius: 'xl'
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3
      }}
      transitionProps={{
        transition: 'slide-left',
        duration: 250,
        timingFunction: 'ease'
      }}
      styles={{
        header: {
          padding: 'var(--mantine-spacing-lg)',
          borderBottom: '1px solid var(--mantine-color-gray-2)'
        },
        body: {
          padding: 0
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      <Paper p="lg" style={{ flex: 1, overflow: 'hidden' }}>
        {drawerContent}
      </Paper>
    </Drawer>
  );
}

// Filter trigger button component
interface FilterTriggerProps {
  onClick: () => void;
  filterCount: number;
  hasColumns?: boolean;
}

export function FilterTrigger({ onClick, filterCount, hasColumns = false }: FilterTriggerProps) {
  return (
    <Tooltip 
      label={`${filterCount} active filter${filterCount !== 1 ? 's' : ''}${hasColumns ? ' • Manage columns' : ''}`} 
      disabled={filterCount === 0 && !hasColumns}
    >
      <Button
        variant={filterCount > 0 ? 'light' : 'default'}
        leftSection={hasColumns ? <IconAdjustments size={16} /> : <IconFilter size={16} />}
        onClick={onClick}
        rightSection={
          filterCount > 0 && (
            <Badge size="sm" circle variant="filled" color="blue">
              {filterCount}
            </Badge>
          )
        }
        styles={{
          root: {
            transition: 'all 200ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }
          }
        }}
      >
        {hasColumns ? 'Options' : 'Filters'}
      </Button>
    </Tooltip>
  );
}