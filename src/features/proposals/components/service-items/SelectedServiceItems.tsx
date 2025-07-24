import { useState, useMemo } from 'react';
import {
  Stack,
  Text,
  Group,
  Box,
  NumberInput,
  Textarea,
  ActionIcon,
  Badge,
  Paper,
  Tooltip,
  ScrollArea,
  ThemeIcon,
  Select,
  Button,
  Divider,
  SimpleGrid,
  Card,
  Center,
  TextInput,
} from '@mantine/core';
import {
  IconTrash,
  IconRefresh,
  IconCurrencyRupee,
  IconCurrencyDollar,
  IconCurrencyDirham,
  IconPackage,
  IconPlus,
  IconCalendar,
  IconX,
} from '@tabler/icons-react';
import type { ServiceItemLineItem } from '@/types/service-item';
import { MoneyDisplay, formatCurrency } from '@/components/ui/MoneyDisplay';
import classes from './SelectedServiceItems.module.css';

interface SelectedServiceItemsProps {
  selectedItems: ServiceItemLineItem[];
  partnerDiscount: number;
  onUpdateItem: (lineItemId: string, updates: Partial<ServiceItemLineItem>) => void;
  onRemoveItem: (lineItemId: string) => void;
  calculateEffectivePrice: (basePrice: number) => number;
  allowPriceOverride?: boolean;
  readOnly?: boolean;
}

export function SelectedServiceItems({
  selectedItems,
  partnerDiscount,
  onUpdateItem,
  onRemoveItem,
  calculateEffectivePrice,
  allowPriceOverride = true,
  readOnly = false,
}: SelectedServiceItemsProps) {
  const calculateItemTotal = (item: ServiceItemLineItem) => {
    const baseTotal = item.negotiated_price;
    const subItemsTotal = item.sub_items?.reduce((sum, sub) => sum + sub.negotiated_price, 0) || 0;
    return baseTotal + subItemsTotal;
  };

  const calculateGrandTotal = () => {
    return selectedItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <Stack gap="md">
      <Paper withBorder>
        <Stack gap={0}>
          {/* Header */}
          <Group justify="space-between" p="md" className={classes.header}>
            <Group gap="sm">
              <ThemeIcon size="md" radius="md" variant="light">
                <IconPackage size={18} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="sm">Selected Service Items</Text>
                <Text size="xs" c="dimmed">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </Text>
              </div>
            </Group>
            <MoneyDisplay
              amount={calculateGrandTotal()}
              currency="INR"
              size="lg"
              fw={700}
              c="blue"
            />
          </Group>

          {/* Service Items List */}
          <ScrollArea className={classes.scrollArea} h={400}>
            <Stack gap="sm" p="md">
              {selectedItems.map((item) => {
                const effectivePrice = calculateEffectivePrice(item.original_price);
                const hasDiscount = item.original_price > effectivePrice;
                const itemTotal = calculateItemTotal(item);

                return (
                  <Paper key={item.id} p="md" withBorder className={classes.serviceCard}>
                    <Stack gap="sm">
                      {/* Item Header */}
                      <Group justify="space-between" align="flex-start">
                        <Box style={{ flex: 1 }}>
                          <Group gap="sm" align="center" mb={4}>
                            <Badge size="xs" variant="dot" color="blue">
                              {item.service_item_code}
                            </Badge>
                            <Text fw={600} size="sm">
                              {item.service_item_name}
                            </Text>
                          </Group>
                          {item.description && (
                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {item.description}
                            </Text>
                          )}
                        </Box>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => onRemoveItem(item.id)}
                          disabled={readOnly}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>

                      {/* Price Section */}
                      <Group gap="md" align="flex-end">
                        <Box>
                          <Text size="xs" c="dimmed" mb={4}>Original Price</Text>
                          <MoneyDisplay
                            amount={item.original_price}
                            currency={item.currency_code}
                            size="sm"
                            fw={500}
                          />
                        </Box>

                        {hasDiscount && (
                          <Box>
                            <Text size="xs" c="dimmed" mb={4}>Effective Price</Text>
                            <MoneyDisplay
                              amount={effectivePrice}
                              currency={item.currency_code}
                              size="sm"
                              fw={500}
                              c="green"
                            />
                          </Box>
                        )}

                        <Box>
                          <Text size="xs" c="dimmed" mb={4}>Final Price</Text>
                          <NumberInput
                            size="sm"
                            value={item.negotiated_price}
                            onChange={(value) => onUpdateItem(item.id, { 
                              negotiated_price: Number(value) || item.original_price 
                            })}
                            min={0}
                            step={100}
                            disabled={readOnly || !allowPriceOverride}
                            className={classes.priceInput}
                            rightSection={
                              <IconCurrencyRupee size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
                            }
                          />
                        </Box>

                        <Box>
                          <Text size="xs" c="dimmed" mb={4}>Total</Text>
                          <MoneyDisplay
                            amount={itemTotal}
                            currency={item.currency_code}
                            size="sm"
                            fw={600}
                            c="blue"
                          />
                        </Box>
                      </Group>

                      {/* Notes */}
                      <Box>
                        <Text size="xs" c="dimmed" mb={4}>Notes</Text>
                        <Textarea
                          size="xs"
                          placeholder="Add notes for this service item..."
                          value={item.description || ''}
                          onChange={(e) => onUpdateItem(item.id, { 
                            description: e.currentTarget.value 
                          })}
                          disabled={readOnly}
                          className={classes.notesInput}
                          autosize
                          minRows={2}
                          maxRows={4}
                        />
                      </Box>

                      {/* Sub-items */}
                      {item.sub_items && item.sub_items.length > 0 && (
                        <Box className={classes.componentsSection}>
                          <Text size="xs" fw={600} mb="xs">Included Components</Text>
                          <Stack gap="xs">
                            {item.sub_items.map((subItem) => (
                              <Group key={subItem.id} justify="space-between">
                                <Text size="xs">{subItem.service_item_name}</Text>
                                <MoneyDisplay
                                  amount={subItem.negotiated_price}
                                  currency={subItem.currency_code}
                                  size="xs"
                                />
                              </Group>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </ScrollArea>

          {/* Total Row */}
          <Group justify="space-between" p="md" className={classes.totalRow}>
            <Text fw={600} size="lg">Grand Total</Text>
            <MoneyDisplay
              amount={calculateGrandTotal()}
              currency="INR"
              size="lg"
              fw={700}
              c="blue"
            />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}