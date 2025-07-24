import { Table, Text, Group, Badge, Stack, Paper, Box, ScrollArea } from '@mantine/core';
import { IconPackage } from '@tabler/icons-react';
import { MoneyDisplay } from './MoneyDisplay';
import type { ServiceItemLineItem } from '@/types/service-item';
import type { CurrencyCode } from '@/types/common';

interface ServiceItemsDisplayProps {
  items: ServiceItemLineItem[];
  currency?: CurrencyCode;
  showSubItems?: boolean;
  compact?: boolean;
  showTotals?: boolean;
}

export function ServiceItemsDisplay({
  items,
  currency = 'INR',
  showSubItems = true,
  compact = false,
  showTotals = true
}: ServiceItemsDisplayProps) {
  const calculateItemTotal = (item: ServiceItemLineItem): number => {
    const mainPrice = item.negotiated_price;
    const subItemsTotal = item.sub_items?.reduce((sum, sub) => sum + sub.negotiated_price, 0) || 0;
    return mainPrice + subItemsTotal;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const renderServiceItem = (item: ServiceItemLineItem, isSubItem = false) => (
    <Table.Tr key={item.id} style={{ backgroundColor: isSubItem ? 'var(--mantine-color-gray-0)' : undefined }}>
      <Table.Td>
        <Group gap="sm">
          {isSubItem && <Box w={20} />}
          <div>
            <Text size={compact ? 'sm' : 'md'} fw={isSubItem ? 400 : 500}>
              {item.service_item_name}
            </Text>
            {item.description && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {item.description}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td w={100}>
        <Badge size="xs" variant="dot" color="gray">
          {item.service_item_code}
        </Badge>
      </Table.Td>
      <Table.Td w={120} ta="right">
        <Stack gap={2} align="flex-end">
          <MoneyDisplay
            amount={item.negotiated_price}
            currency={item.currency_code || currency}
            size={compact ? 'sm' : 'md'}
            fw={500}
          />
          {item.original_price > item.negotiated_price && (
            <div style={{ textDecoration: 'line-through' }}>
              <MoneyDisplay
                amount={item.original_price}
                currency={item.currency_code || currency}
                size="xs"
                c="dimmed"
              />
            </div>
          )}
        </Stack>
      </Table.Td>
    </Table.Tr>
  );

  if (items.length === 0) {
    return (
      <Paper p="lg" withBorder>
        <Group justify="center">
          <IconPackage size={32} stroke={1.5} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <Text c="dimmed">No service items added</Text>
        </Group>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <ScrollArea type="auto">
        <Table striped={!compact} highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Service Item</Table.Th>
              <Table.Th w={100}>Code</Table.Th>
              <Table.Th w={120} ta="right">Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map(item => (
              <>
                {renderServiceItem(item)}
                {showSubItems && item.sub_items?.map(subItem => 
                  renderServiceItem(subItem, true)
                )}
              </>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {showTotals && (
        <Paper p="md" withBorder>
          <Group justify="space-between">
            <Text fw={600} size="lg">Total Amount</Text>
            <MoneyDisplay
              amount={grandTotal}
              currency={currency}
              size="lg"
              fw={700}
              c="blue"
            />
          </Group>
        </Paper>
      )}
    </Stack>
  );
}