import { useState, useMemo } from 'react';
import {
  Stack,
  TextInput,
  Text,
  Group,
  Badge,
  Box,
  ActionIcon,
  Paper,
  Button,
  Select,
  ScrollArea,
  Collapse,
  Divider,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconSearch,
  IconChevronRight,
  IconChevronDown,
  IconPlus,
  IconCheck,
  IconPackage,
  IconX,
} from '@tabler/icons-react';
import type { 
  ServiceItemWithSubItems, 
  ServiceItemFilters 
} from '@/types/service-item';
import { MoneyDisplay, formatCurrency } from '@/components/ui/MoneyDisplay';
import classes from './ServiceCatalog.module.css';

interface ServiceCatalogProps {
  items: ServiceItemWithSubItems[];
  selectedItemIds: Set<number>;
  partnerDiscount: number;
  onAddItem: (item: ServiceItemWithSubItems) => void;
  onFiltersChange?: (filters: ServiceItemFilters) => void;
  calculateEffectivePrice: (basePrice: number) => number;
  readOnly?: boolean;
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'tax', label: 'Tax Services' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'audit', label: 'Audit Services' },
  { value: 'transfer_pricing', label: 'Transfer Pricing' },
  { value: 'advisory', label: 'Advisory' },
  { value: 'other', label: 'Other Services' },
];

export function ServiceCatalog({
  items,
  selectedItemIds,
  partnerDiscount,
  onAddItem,
  onFiltersChange,
  calculateEffectivePrice,
  readOnly = false,
}: ServiceCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (itemId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower) ||
        (item.description?.toLowerCase().includes(searchLower) || false) ||
        (item.sub_items?.some(sub =>
          sub.name.toLowerCase().includes(searchLower) ||
          sub.code.toLowerCase().includes(searchLower)
        ) || false)
      );
    });
  }, [items, searchTerm, selectedCategory]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange?.({ search: value, category: (selectedCategory || undefined) as any });
  };

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value || '');
    onFiltersChange?.({ search: searchTerm, category: (value || undefined) as any });
  };

  const selectedCount = selectedItemIds.size;

  return (
    <Stack h="100%" gap={0}>
      {/* Header */}
      <Box p="md" className={classes.header}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Group>
              <Text fw={600} size="lg">Service Catalog</Text>
              <Badge variant="filled" color="gray">
                {items.length} Services
              </Badge>
            </Group>
            {partnerDiscount > 0 && (
              <Badge color="blue" variant="light">
                {partnerDiscount}% Partner Discount
              </Badge>
            )}
          </Group>

          {/* Filters */}
          <Group gap="xs">
            <TextInput
              placeholder="Search services..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                searchTerm && (
                  <ActionIcon size="sm" variant="subtle" onClick={() => handleSearchChange('')}>
                    <IconX size={14} />
                  </ActionIcon>
                )
              }
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Category"
              data={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              clearable
              style={{ width: 200 }}
            />
          </Group>

          {selectedCount > 0 && (
            <Text size="sm" c="dimmed">
              {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
            </Text>
          )}
        </Stack>
      </Box>

      <Divider />

      {/* Service List */}
      <ScrollArea style={{ flex: 1 }} className={classes.scrollArea}>
        <Stack gap="xs" p="md">
          {filteredItems.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <ThemeIcon size={64} radius="xl" variant="light" color="gray">
                  <IconSearch size={32} />
                </ThemeIcon>
                <Text size="lg" fw={500} c="dimmed">No services found</Text>
                <Text size="sm" c="dimmed">Try adjusting your search or filters</Text>
              </Stack>
            </Center>
          ) : (
            filteredItems.map(item => {
              const isExpanded = expandedItems.has(item.id);
              const isSelected = selectedItemIds.has(item.id);

              return (
                <Paper
                  key={item.id}
                  withBorder
                  p="sm"
                  className={classes.serviceItem}
                  data-selected={isSelected}
                >
                  <Stack gap="xs">
                    <Group gap="xs" wrap="nowrap">
                      {/* Expand button */}
                      {item.has_sub_items && item.sub_items && item.sub_items.length > 0 && (
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </ActionIcon>
                      )}

                      {/* Service info */}
                      <Box style={{ flex: 1 }}>
                        <Group gap="xs" mb={4}>
                          <Text fw={600} size="sm">{item.name}</Text>
                          <Badge size="xs" variant="dot" color="gray">
                            {item.code}
                          </Badge>
                          {item.has_sub_items && (
                            <Badge size="xs" variant="light" color="blue">
                              <Group gap={4}>
                                <IconPackage size={12} />
                                {item.sub_items?.length || 0} items
                              </Group>
                            </Badge>
                          )}
                        </Group>
                        {item.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {item.description}
                          </Text>
                        )}
                      </Box>

                      {/* Price and action */}
                      <Group gap="sm" align="center">
                        <Box style={{ textAlign: 'right' }}>
                          <MoneyDisplay
                            amount={calculateEffectivePrice(item.default_price)}
                            currency={item.currency_code}
                            fw={600}
                            size="sm"
                          />
                          {partnerDiscount > 0 && (
                            <Text size="xs" c="dimmed" td="line-through">
                              {formatCurrency(item.default_price, item.currency_code)}
                            </Text>
                          )}
                        </Box>
                        <Button
                          size="sm"
                          variant={isSelected ? 'filled' : 'light'}
                          color={isSelected ? 'green' : 'blue'}
                          disabled={isSelected || readOnly}
                          onClick={() => !isSelected && !readOnly && onAddItem(item)}
                          leftSection={isSelected ? <IconCheck size={16} /> : <IconPlus size={16} />}
                        >
                          {isSelected ? 'Added' : 'Add'}
                        </Button>
                      </Group>
                    </Group>

                    {/* Sub-items */}
                    {item.has_sub_items && item.sub_items && item.sub_items.length > 0 && (
                      <Collapse in={isExpanded}>
                        <Box className={classes.subItemsContainer}>
                          <Divider label="Included Components" labelPosition="left" mb="xs" />
                          <Stack gap={4}>
                            {item.sub_items.map(subItem => (
                              <Group key={subItem.id} justify="space-between" className={classes.subItem}>
                                <Group gap="xs">
                                  <IconCheck size={14} className={classes.checkIcon} />
                                  <Text size="xs">{subItem.name}</Text>
                                  <Badge size="xs" variant="outline" color="gray">
                                    {subItem.code}
                                  </Badge>
                                </Group>
                                <MoneyDisplay
                                  amount={calculateEffectivePrice(subItem.default_price)}
                                  currency={subItem.currency_code}
                                  size="xs"
                                  fw={500}
                                />
                              </Group>
                            ))}
                            <Group justify="space-between" pt="xs" className={classes.totalRow}>
                              <Text size="sm" fw={600}>Package Total</Text>
                              <MoneyDisplay
                                amount={calculateEffectivePrice(
                                  item.default_price + 
                                  (item.sub_items?.reduce((sum, sub) => sum + sub.default_price, 0) || 0)
                                )}
                                currency={item.currency_code}
                                size="sm"
                                fw={700}
                                c="blue"
                              />
                            </Group>
                          </Stack>
                        </Box>
                      </Collapse>
                    )}
                  </Stack>
                </Paper>
              );
            })
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}