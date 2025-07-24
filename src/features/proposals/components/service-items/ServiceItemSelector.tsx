import { useState, useMemo } from 'react';
import {
  Stack,
  Text,
  Group,
  Box,
  TextInput,
  Badge,
  Paper,
  ScrollArea,
  ThemeIcon,
  Button,
  Divider,
  SimpleGrid,
  Card,
  Center,
  Checkbox,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconSearch,
  IconPackage,
  IconPlus,
  IconInfoCircle,
  IconFilter,
  IconX,
} from '@tabler/icons-react';
import type { ServiceItem, ServiceItemLineItem } from '@/types/service-item';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { SelectedServiceItems } from './SelectedServiceItems';
import classes from './ServiceItemSelector.module.css';

interface ServiceItemSelectorProps {
  availableItems: ServiceItem[];
  selectedItems: ServiceItemLineItem[];
  partnerDiscount: number;
  onAddItem: (item: ServiceItem) => void;
  onUpdateItem: (lineItemId: string, updates: Partial<ServiceItemLineItem>) => void;
  onRemoveItem: (lineItemId: string) => void;
  calculateEffectivePrice: (basePrice: number) => number;
  allowPriceOverride?: boolean;
  readOnly?: boolean;
  maxItems?: number;
}

export function ServiceItemSelector({
  availableItems,
  selectedItems,
  partnerDiscount,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  calculateEffectivePrice,
  allowPriceOverride = true,
  readOnly = false,
  maxItems,
}: ServiceItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  // Filter available items
  const filteredItems = useMemo(() => {
    return availableItems.filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesActive = !showOnlyActive || item.is_active;
      
      return matchesSearch && matchesCategory && matchesActive;
    });
  }, [availableItems, searchTerm, selectedCategory, showOnlyActive]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(availableItems.map(item => item.category))];
    return [
      { value: 'all', label: 'All Categories' },
      ...cats.map(cat => ({
        value: cat,
        label: cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }))
    ];
  }, [availableItems]);

  const handleAddItem = (item: ServiceItem) => {
    if (maxItems && selectedItems.length >= maxItems) {
      return;
    }
    
    const lineItem: ServiceItemLineItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      service_item_id: item.id,
      service_item_name: item.name,
      service_item_code: item.code,
      description: item.description,
      original_price: item.default_price,
      negotiated_price: calculateEffectivePrice(item.default_price),
      currency_code: 'INR',
      price_source: partnerDiscount > 0 ? 'partner' : 'default',
    };
    
    onAddItem(item);
  };

  const isItemSelected = (item: ServiceItem) => {
    return selectedItems.some(selected => selected.service_item_id === item.id);
  };

  if (readOnly && !allowPriceOverride) return;

  return (
    <div className={classes.container}>
      {/* Service Catalog */}
      <Paper withBorder>
        <Stack gap={0}>
          {/* Header */}
          <Group justify="space-between" p="md" className={classes.header}>
            <Group gap="sm">
              <ThemeIcon size="md" radius="md" variant="light">
                <IconPackage size={18} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="sm">Service Catalog</Text>
                <Text size="xs" c="dimmed">
                  {filteredItems.length} service{filteredItems.length !== 1 ? 's' : ''} available
                </Text>
              </div>
            </Group>
            {maxItems && (
              <Badge variant="light" color="blue">
                {selectedItems.length}/{maxItems} selected
              </Badge>
            )}
          </Group>

          {/* Filters */}
          <Box p="md" className={classes.filters}>
            <Group gap="md">
              <TextInput
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  searchTerm && (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => setSearchTerm('')}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  )
                }
                style={{ flex: 1 }}
              />
              
              <Group gap="xs">
                <Checkbox
                  label="Active only"
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.currentTarget.checked)}
                  size="xs"
                />
              </Group>
            </Group>
          </Box>

          <Divider />

          {/* Service List */}
          <ScrollArea h={400} className={classes.scrollArea}>
            <Stack gap="sm" p="md">
              {filteredItems.map((item) => {
                const isSelected = isItemSelected(item);
                const effectivePrice = calculateEffectivePrice(item.default_price);
                const hasDiscount = item.default_price > effectivePrice;

                return (
                  <Card
                    key={item.id}
                    p="md"
                    withBorder
                    className={`${classes.serviceCard} ${isSelected ? classes.selected : ''}`}
                  >
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Group gap="sm" align="center" mb={4}>
                          <Badge size="xs" variant="dot" color="blue">
                            {item.code}
                          </Badge>
                          <Text fw={600} size="sm">
                            {item.name}
                          </Text>
                          {item.has_sub_items && (
                            <Badge size="xs" variant="light" color="green">
                              Package
                            </Badge>
                          )}
                        </Group>
                        
                        {item.description && (
                          <Text size="xs" c="dimmed" lineClamp={2} mb="sm">
                            {item.description}
                          </Text>
                        )}

                        <Group gap="sm">
                          <Badge size="xs" variant="light" color="gray">
                            {item.category.replace('_', ' ')}
                          </Badge>
                          {!item.is_active && (
                            <Badge size="xs" variant="light" color="red">
                              Inactive
                            </Badge>
                          )}
                        </Group>
                      </Box>

                      <Stack gap="xs" align="flex-end">
                        <MoneyDisplay
                          amount={effectivePrice}
                          currency="INR"
                          size="sm"
                          fw={600}
                          c={hasDiscount ? 'green' : 'blue'}
                        />
                        
                        {hasDiscount && (
                          <Text size="xs" c="dimmed" td="line-through">
                            <MoneyDisplay
                              amount={item.default_price}
                              currency="INR"
                              size="xs"
                            />
                          </Text>
                        )}

                        <Button
                          size="xs"
                          variant={isSelected ? "light" : "filled"}
                          color={isSelected ? "gray" : "blue"}
                          leftSection={<IconPlus size={14} />}
                          onClick={() => handleAddItem(item)}
                          disabled={isSelected || (maxItems ? selectedItems.length >= maxItems : false) || readOnly}
                        >
                          {isSelected ? 'Added' : 'Add'}
                        </Button>
                      </Stack>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </ScrollArea>

          {filteredItems.length === 0 && (
            <Center p="xl">
              <Stack align="center" gap="sm">
                <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                  <IconPackage size={24} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">No services found</Text>
                {searchTerm && (
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                )}
              </Stack>
            </Center>
          )}
        </Stack>
      </Paper>

      {/* Selected Services */}
      <SelectedServiceItems
        selectedItems={selectedItems}
        partnerDiscount={partnerDiscount}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        calculateEffectivePrice={calculateEffectivePrice}
        allowPriceOverride={allowPriceOverride}
        readOnly={readOnly}
      />
    </div>
  );
}