import { 
  Checkbox, 
  Stack, 
  Group, 
  Text, 
  Button, 
  ScrollArea,
  TextInput,
  ActionIcon,
  Divider,
  Tooltip,
  Paper
} from '@mantine/core';
import { 
  IconGripVertical, 
  IconEye, 
  IconSearch,
  IconX,
  IconColumns3
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface ColumnDefinition {
  accessor: string;
  title: string;
  defaultVisible?: boolean;
  alwaysVisible?: boolean;
  description?: string;
}

interface ColumnSelectorProps {
  columns: ColumnDefinition[];
  visibleColumns: string[];
  onVisibilityChange: (visibleColumns: string[]) => void;
  onColumnReorder?: (columns: string[]) => void;
  searchable?: boolean;
  showSelectAll?: boolean;
  maxHeight?: number | string;
}

interface SortableColumnItemProps {
  column: ColumnDefinition;
  isVisible: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function SortableColumnItem({ column, isVisible, onToggle, disabled }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.accessor, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      withBorder
      p="xs"
      {...attributes}
    >
      <Group gap="xs" wrap="nowrap">
        <div {...listeners} style={{ cursor: disabled ? 'not-allowed' : 'grab' }}>
          <IconGripVertical 
            size={16} 
            style={{ 
              opacity: disabled ? 0.3 : 0.5
            }} 
          />
        </div>
        <Checkbox
          checked={isVisible}
          onChange={onToggle}
          disabled={disabled}
          label={
            <Group gap={4}>
              <Text size="sm">{column.title}</Text>
              {column.alwaysVisible && (
                <Tooltip label="This column is always visible">
                  <IconEye size={14} style={{ opacity: 0.5 }} />
                </Tooltip>
              )}
            </Group>
          }
          styles={{ body: { alignItems: 'center' } }}
        />
      </Group>
      {column.description && (
        <Text size="xs" c="dimmed" mt={4} ml={28}>
          {column.description}
        </Text>
      )}
    </Paper>
  );
}

export function ColumnSelector({
  columns,
  visibleColumns,
  onVisibilityChange,
  onColumnReorder,
  searchable = true,
  showSelectAll = true,
  maxHeight = 400
}: ColumnSelectorProps) {
  const [search, setSearch] = useState('');
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map(col => col.accessor)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter columns based on search
  const filteredColumns = useMemo(() => {
    const searchLower = search.toLowerCase();
    return columns.filter(col => 
      col.title.toLowerCase().includes(searchLower) ||
      col.accessor.toLowerCase().includes(searchLower)
    );
  }, [columns, search]);

  // Handle visibility toggle
  const handleToggle = (accessor: string) => {
    const column = columns.find(col => col.accessor === accessor);
    if (column?.alwaysVisible) return;

    if (visibleColumns.includes(accessor)) {
      onVisibilityChange(visibleColumns.filter(col => col !== accessor));
    } else {
      onVisibilityChange([...visibleColumns, accessor]);
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const selectableColumns = columns
      .filter(col => !col.alwaysVisible)
      .map(col => col.accessor);
    
    const allSelected = selectableColumns.every(col => 
      visibleColumns.includes(col)
    );

    if (allSelected) {
      // Deselect all except always visible
      onVisibilityChange(
        columns
          .filter(col => col.alwaysVisible)
          .map(col => col.accessor)
      );
    } else {
      // Select all
      onVisibilityChange(columns.map(col => col.accessor));
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        onColumnReorder?.(newOrder);
        return newOrder;
      });
    }
  };

  const selectableColumns = columns.filter(col => !col.alwaysVisible);
  const allSelected = selectableColumns.every(col => 
    visibleColumns.includes(col.accessor)
  );
  const someSelected = selectableColumns.some(col => 
    visibleColumns.includes(col.accessor)
  );

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconColumns3 size={20} />
          <Text fw={500}>Manage Columns</Text>
        </Group>
        <Text size="sm" c="dimmed">
          {visibleColumns.length} of {columns.length} visible
        </Text>
      </Group>

      {searchable && (
        <TextInput
          placeholder="Search columns..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          rightSection={
            search && (
              <ActionIcon 
                size="sm" 
                variant="subtle" 
                onClick={() => setSearch('')}
              >
                <IconX size={14} />
              </ActionIcon>
            )
          }
        />
      )}

      {showSelectAll && (
        <>
          <Group justify="space-between">
            <Checkbox
              label="Select all columns"
              checked={allSelected}
              indeterminate={!allSelected && someSelected}
              onChange={handleSelectAll}
            />
            <Button
              size="xs"
              variant="subtle"
              onClick={() => {
                onVisibilityChange(
                  columns
                    .filter(col => col.defaultVisible !== false)
                    .map(col => col.accessor)
                );
              }}
            >
              Reset to default
            </Button>
          </Group>
          <Divider />
        </>
      )}

      <ScrollArea.Autosize mah={maxHeight} offsetScrollbars>
        {onColumnReorder ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columnOrder}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {columnOrder
                  .map(accessor => columns.find(col => col.accessor === accessor))
                  .filter(Boolean)
                  .filter(col => filteredColumns.includes(col!))
                  .map((column) => (
                    <SortableColumnItem
                      key={column!.accessor}
                      column={column!}
                      isVisible={visibleColumns.includes(column!.accessor)}
                      onToggle={() => handleToggle(column!.accessor)}
                      disabled={column!.alwaysVisible}
                    />
                  ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Stack gap="xs">
            {filteredColumns.map((column) => (
              <Paper key={column.accessor} withBorder p="xs">
                <Checkbox
                  checked={visibleColumns.includes(column.accessor)}
                  onChange={() => handleToggle(column.accessor)}
                  disabled={column.alwaysVisible}
                  label={
                    <Group gap={4}>
                      <Text size="sm">{column.title}</Text>
                      {column.alwaysVisible && (
                        <Tooltip label="This column is always visible">
                          <IconEye size={14} style={{ opacity: 0.5 }} />
                        </Tooltip>
                      )}
                    </Group>
                  }
                />
                {column.description && (
                  <Text size="xs" c="dimmed" mt={4} ml={22}>
                    {column.description}
                  </Text>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </ScrollArea.Autosize>

      {filteredColumns.length === 0 && (
        <Text ta="center" c="dimmed" size="sm" py="xl">
          No columns match your search
        </Text>
      )}
    </Stack>
  );
}