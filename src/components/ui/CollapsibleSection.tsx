import { useState } from 'react';
import { Paper, Group, Text, ActionIcon, Collapse, Box, Badge, Divider } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  badge?: string | number;
  badgeColor?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  rightSection?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
  showDivider?: boolean;
}

export function CollapsibleSection({
  title,
  description,
  badge,
  badgeColor = 'blue',
  defaultOpen = true,
  icon,
  rightSection,
  children,
  noPadding = false,
  showDivider = true
}: CollapsibleSectionProps) {
  const [opened, setOpened] = useState(defaultOpen);

  return (
    <Paper withBorder>
      <Box
        p="md"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpened(!opened)}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                setOpened(!opened);
              }}
            >
              {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ActionIcon>
            {icon && <Box c="dimmed">{icon}</Box>}
            <div>
              <Group gap="xs">
                <Text fw={600}>{title}</Text>
                {badge !== undefined && (
                  <Badge size="sm" variant="filled" color={badgeColor}>
                    {badge}
                  </Badge>
                )}
              </Group>
              {description && (
                <Text size="sm" c="dimmed" mt={2}>
                  {description}
                </Text>
              )}
            </div>
          </Group>
          {rightSection && (
            <Box onClick={(e) => e.stopPropagation()}>
              {rightSection}
            </Box>
          )}
        </Group>
      </Box>

      {showDivider && opened && <Divider />}

      <Collapse in={opened}>
        <Box p={noPadding ? 0 : 'md'}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
}