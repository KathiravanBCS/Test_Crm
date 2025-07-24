import { useState, useMemo } from 'react';
import {
  Stack,
  Group,
  Text,
  Badge,
  TextInput,
  ActionIcon,
  Box,
  Paper,
  Transition,
  NumberInput,
  Textarea,
  Checkbox,
  Button,
} from '@mantine/core';
import {
  IconSearch,
  IconX,
  IconCurrencyRupee,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import type { SelectedServiceItem } from '../types';
import type { ProposalServiceItem } from '@/features/proposals/types';
import type { ServiceItemLineItem } from '@/types/service-item';

interface ServiceItemSelectorProps {
  proposalServiceItems: (ProposalServiceItem | ServiceItemLineItem)[];
  selectedItems: SelectedServiceItem[];
  onSelectionChange: (items: SelectedServiceItem[]) => void;
  currencyCode?: string;
}

interface NormalizedItem {
  id: number;
  serviceName: string;
  serviceDescription: string;
  serviceRate: number;
  originalRate: number;
  masterServiceItemId?: number;
  isStandard?: boolean;
}

export function ServiceItemSelector({
  proposalServiceItems,
  selectedItems,
  onSelectionChange,
  currencyCode = 'INR',
}: ServiceItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Normalize service items
  const normalizedItems = useMemo(() => {
    return proposalServiceItems.map((item, index): NormalizedItem => {
      if ('service_item_name' in item) {
        const numericId =
          typeof item.id === 'string'
            ? parseInt(item.id.replace(/[^0-9]/g, '') || String(index + 1), 10)
            : item.id;
        return {
          id: numericId,
          serviceName: item.service_item_name,
          serviceDescription: item.description || '',
          serviceRate: item.negotiated_price || item.original_price || 0,
          originalRate: item.original_price || item.negotiated_price || 0,
          masterServiceItemId: item.service_item_id,
          isStandard: true,
        };
      } else {
        return {
          id: item.id,
          serviceName: item.serviceName || (item as any).name || '',
          serviceDescription: item.serviceDescription || (item as any).description || '',
          serviceRate:
            (item as any).serviceRate ||
            (item as any).negotiated_price ||
            (item as any).original_price ||
            0,
          originalRate:
            (item as any).serviceRate ||
            (item as any).negotiated_price ||
            (item as any).original_price ||
            0,
          masterServiceItemId:
            (item as any).masterServiceItemId || (item as any).master_service_item_id,
          isStandard: !!(item as any).masterServiceItemId || !!(item as any).master_service_item_id,
        };
      }
    });
  }, [proposalServiceItems]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return normalizedItems;
    const query = searchQuery.toLowerCase();
    return normalizedItems.filter(
      (item) =>
        item.serviceName.toLowerCase().includes(query) ||
        item.serviceDescription.toLowerCase().includes(query)
    );
  }, [normalizedItems, searchQuery]);

  // Toggle item selection
  const toggleItem = (item: NormalizedItem) => {
    const isSelected = selectedItems.some((si) => si.proposalServiceItemId === item.id);
    
    if (isSelected) {
      onSelectionChange(
        selectedItems.filter((si) => si.proposalServiceItemId !== item.id)
      );
      setExpandedItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    } else {
      const newItem: SelectedServiceItem = {
        proposalServiceItemId: item.id,
        serviceName: item.serviceName,
        serviceDescription: item.serviceDescription,
        serviceRate: item.serviceRate,
        originalRate: item.serviceRate,
        originalDescription: item.serviceDescription,
      };
      onSelectionChange([...selectedItems, newItem]);
    }
  };

  // Toggle expand/collapse for item
  const toggleExpand = (itemId: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Get selected item data
  const getSelectedItem = (itemId: number) => {
    return selectedItems.find((si) => si.proposalServiceItemId === itemId);
  };

  // Calculate total amount
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.serviceRate, 0);

  return (
    <Stack gap="lg">
      {/* Header Section */}
      <Box>
        <Group justify="space-between" mb="xs">
          <Text fw={600} size="lg">
            Service Items Selection
          </Text>
          <Badge size="lg" variant="filled" color="blue">
            {selectedItems.length} of {normalizedItems.length} selected
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          Select service items from the proposal and customize rates if needed
        </Text>
      </Box>

      {/* Search Bar */}
      <TextInput
        placeholder="Search by service name or description"
        leftSection={<IconSearch size={16} />}
        rightSection={
          searchQuery && (
            <ActionIcon variant="subtle" onClick={() => setSearchQuery('')} size="sm">
              <IconX size={14} />
            </ActionIcon>
          )
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Service Items List */}
      <Stack gap="xs">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.some((si) => si.proposalServiceItemId === item.id);
          const selectedItem = getSelectedItem(item.id);
          const isExpanded = expandedItems.has(item.id);

          return (
            <ServiceItemRow
              key={item.id}
              item={item}
              isSelected={isSelected}
              isExpanded={isExpanded}
              selectedItem={selectedItem}
              onToggle={() => toggleItem(item)}
              onExpand={() => toggleExpand(item.id)}
              onUpdateRate={(rate) => {
                onSelectionChange(
                  selectedItems.map((si) =>
                    si.proposalServiceItemId === item.id
                      ? { ...si, serviceRate: rate }
                      : si
                  )
                );
              }}
              onUpdateDescription={(desc) => {
                onSelectionChange(
                  selectedItems.map((si) =>
                    si.proposalServiceItemId === item.id
                      ? { ...si, serviceDescription: desc }
                      : si
                  )
                );
              }}
              currencyCode={currencyCode}
            />
          );
        })}

        {filteredItems.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No services found matching your search
          </Text>
        )}
      </Stack>

      {/* Summary Section */}
      {selectedItems.length > 0 && (
        <Paper withBorder p="md" bg="gray.0">
          <Group justify="space-between">
            <Text fw={500}>Total Selected Items Value</Text>
            <Group gap="xs">
              <IconCurrencyRupee size={18} />
              <Text fw={600} size="lg">
                {totalAmount.toLocaleString()}
              </Text>
            </Group>
          </Group>
        </Paper>
      )}
    </Stack>
  );
}

// Individual Service Item Row Component
interface ServiceItemRowProps {
  item: NormalizedItem;
  isSelected: boolean;
  isExpanded: boolean;
  selectedItem?: SelectedServiceItem;
  onToggle: () => void;
  onExpand: () => void;
  onUpdateRate: (rate: number) => void;
  onUpdateDescription: (desc: string) => void;
  currencyCode: string;
}

function ServiceItemRow({
  item,
  isSelected,
  isExpanded,
  selectedItem,
  onToggle,
  onExpand,
  onUpdateRate,
  onUpdateDescription,
}: ServiceItemRowProps) {
  return (
    <Paper
      withBorder
      p="md"
      style={(theme) => ({
        backgroundColor: isSelected ? theme.colors.blue[0] : undefined,
        borderColor: isSelected ? theme.colors.blue[4] : undefined,
        transition: 'all 0.2s ease',
      })}
    >
      <Stack gap="sm">
        {/* Main Row */}
        <Group justify="space-between">
          <Group gap="md" style={{ flex: 1 }}>
            <Checkbox
              checked={isSelected}
              onChange={() => onToggle()}
              size="md"
            />
            <Stack gap={4} style={{ flex: 1 }}>
              <Group gap="xs">
                <Text fw={500}>{item.serviceName}</Text>
                {item.isStandard && (
                  <Badge size="xs" variant="light" color="blue">
                    Standard Service
                  </Badge>
                )}
              </Group>
              {!isExpanded && item.serviceDescription && (
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {item.serviceDescription}
                </Text>
              )}
            </Stack>
          </Group>

          <Group gap="md">
            <Badge
              size="lg"
              variant={isSelected ? 'filled' : 'light'}
              color={isSelected ? 'blue' : 'gray'}
              leftSection={<IconCurrencyRupee size={14} />}
            >
              {(selectedItem?.serviceRate || item.serviceRate).toLocaleString()}
            </Badge>
            {isSelected && (
              <ActionIcon
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
              >
                {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </ActionIcon>
            )}
          </Group>
        </Group>

        {/* Expanded Edit Section */}
        <Transition
          mounted={isSelected && isExpanded && !!selectedItem}
          transition="slide-down"
          duration={200}
        >
          {(styles) => (
            <Box style={styles}>
              {selectedItem && (
                <ServiceItemEditSection
                  item={selectedItem}
                  originalItem={item}
                  onUpdateRate={onUpdateRate}
                  onUpdateDescription={onUpdateDescription}
                />
              )}
            </Box>
          )}
        </Transition>
      </Stack>
    </Paper>
  );
}

// Edit Section Component
interface ServiceItemEditSectionProps {
  item: SelectedServiceItem;
  originalItem: NormalizedItem;
  onUpdateRate: (rate: number) => void;
  onUpdateDescription: (desc: string) => void;
}

function ServiceItemEditSection({
  item,
  originalItem,
  onUpdateRate,
  onUpdateDescription,
}: ServiceItemEditSectionProps) {
  const hasChanges =
    item.serviceRate !== originalItem.originalRate ||
    item.serviceDescription !== originalItem.serviceDescription;

  return (
    <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
      <Group align="flex-start" gap="md">
        <Box style={{ flex: 1 }}>
          <Textarea
            label="Service Description"
            description="Customize the description for this engagement"
            value={item.serviceDescription}
            onChange={(e) => onUpdateDescription(e.target.value)}
            rows={3}
            autosize
            minRows={2}
            maxRows={5}
          />
        </Box>
        
        <Stack gap="xs" style={{ width: 250 }} align="stretch">
          <NumberInput
            label="Engagement Letter Rate"
            description="Modify rate for this engagement letter"
            value={item.serviceRate}
            onChange={(value) => onUpdateRate(Number(value) || 0)}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale={false}
            leftSection={<IconCurrencyRupee size={16} />}
            min={0}
          />
          
          {hasChanges && (
            <Button
              variant="subtle"
              onClick={() => {
                onUpdateRate(originalItem.originalRate);
                onUpdateDescription(originalItem.serviceDescription);
              }}
              size="xs"
              fullWidth
            >
              Reset
            </Button>
          )}
        </Stack>
      </Group>
    </Box>
  );
}