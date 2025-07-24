import { Grid, Text, Group, CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Customer } from '../types';
import { getStateFromGSTIN } from '@/components/forms/inputs/GstinInput';

interface CustomerInfoProps {
  customer: Customer;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  const gstinState = customer.gstin ? getStateFromGSTIN(customer.gstin) : null;

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <div>
          <Text size="xs" c="dimmed">Customer Type</Text>
          <Text size="sm" fw={500}>
            {customer.customerType.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <div>
          <Text size="xs" c="dimmed">Currency</Text>
          <Text size="sm" fw={500}>{customer.currencyCode}</Text>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <div>
          <Text size="xs" c="dimmed">PAN</Text>
          {customer.pan ? (
            <Group gap="xs">
              <Text size="sm" fw={500} ff="monospace">{customer.pan}</Text>
              <CopyButton value={customer.pan} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon 
                      color={copied ? 'teal' : 'gray'} 
                      variant="subtle" 
                      size="xs"
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">Not provided</Text>
          )}
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <div>
          <Text size="xs" c="dimmed">GSTIN</Text>
          {customer.gstin ? (
            <div>
              <Group gap="xs">
                <Text size="sm" fw={500} ff="monospace">{customer.gstin}</Text>
                <CopyButton value={customer.gstin} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                      <ActionIcon 
                        color={copied ? 'teal' : 'gray'} 
                        variant="subtle" 
                        size="xs"
                        onClick={copy}
                      >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
              {gstinState && (
                <Text size="xs" c="dimmed" mt={2}>
                  State: {gstinState.name}
                </Text>
              )}
            </div>
          ) : (
            <Text size="sm" c="dimmed">Not provided</Text>
          )}
        </div>
      </Grid.Col>

      {customer.tan && (
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="xs" c="dimmed">TAN</Text>
            <Group gap="xs">
              <Text size="sm" fw={500} ff="monospace">{customer.tan}</Text>
              <CopyButton value={customer.tan} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon 
                      color={copied ? 'teal' : 'gray'} 
                      variant="subtle" 
                      size="xs"
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>
        </Grid.Col>
      )}
    </Grid>
  );
}