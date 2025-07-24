import { useState } from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
  TextInput,
  Textarea,
  Badge,
  Collapse,
  Grid,
  Tooltip,
  Box,
  Divider,
  Paper,
  Indicator,
} from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import {
  IconPlus,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconGripVertical,
  IconCalendar,
  IconAlertCircle,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { notifications } from '@mantine/notifications';
import type { EngagementPhaseFormData, EngagementServiceItemFormData } from '../types';

interface PhaseManagerProps {
  phases: EngagementPhaseFormData[];
  onChange: (phases: EngagementPhaseFormData[]) => void;
  unassignedServiceItems: EngagementServiceItemFormData[];
  onServiceItemsChange: (items: EngagementServiceItemFormData[]) => void;
  isNotStarted: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

export function PhaseManager({
  phases,
  onChange,
  unassignedServiceItems,
  onServiceItemsChange,
  isNotStarted,
  startDate,
  endDate,
}: PhaseManagerProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const addPhase = () => {
    const newPhase: EngagementPhaseFormData = {
      tempId: `temp-${Date.now()}`,
      phaseName: '',
      phaseDescription: '',
      phaseStartDate: null,
      phaseEndDate: null,
      serviceItems: [],
      isNew: true,
    };
    onChange([...phases, newPhase]);
    setExpandedPhases(new Set([...expandedPhases, newPhase.tempId!]));
  };

  const updatePhase = (index: number, updates: Partial<EngagementPhaseFormData>) => {
    const updatedPhases = [...phases];
    updatedPhases[index] = { ...updatedPhases[index], ...updates };
    onChange(updatedPhases);
  };

  const deletePhase = (index: number) => {
    const phaseToDelete = phases[index];
    const updatedPhases = phases.filter((_, i) => i !== index);
    
    // Move service items back to unassigned
    if (phaseToDelete.serviceItems.length > 0) {
      const itemsToUnassign = phaseToDelete.serviceItems.map(item => ({
        ...item,
        isAssigned: false,
      }));
      onServiceItemsChange([...unassignedServiceItems, ...itemsToUnassign]);
    }
    
    onChange(updatedPhases);
    notifications.show({
      title: 'Phase deleted',
      message: phaseToDelete.serviceItems.length > 0 
        ? 'Service items have been moved back to unassigned'
        : 'Phase has been removed',
      color: 'yellow',
    });
  };

  const togglePhaseExpansion = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'phase') {
      // Reorder phases
      const reorderedPhases = Array.from(phases);
      const [removed] = reorderedPhases.splice(source.index, 1);
      reorderedPhases.splice(destination.index, 0, removed);
      onChange(reorderedPhases);
    } else if (type === 'service-item') {
      // Handle service item drag between phases and unassigned
      const sourcePhaseIndex = source.droppableId === 'unassigned' 
        ? -1 
        : parseInt(source.droppableId.replace('phase-', ''));
      const destPhaseIndex = destination.droppableId === 'unassigned' 
        ? -1 
        : parseInt(destination.droppableId.replace('phase-', ''));

      if (sourcePhaseIndex === destPhaseIndex) {
        // Reordering within same container
        if (sourcePhaseIndex === -1) {
          // Reordering within unassigned
          const reordered = Array.from(unassignedServiceItems);
          const [removed] = reordered.splice(source.index, 1);
          reordered.splice(destination.index, 0, removed);
          onServiceItemsChange(reordered);
        } else {
          // Reordering within a phase
          const updatedPhases = [...phases];
          const items = Array.from(updatedPhases[sourcePhaseIndex].serviceItems);
          const [removed] = items.splice(source.index, 1);
          items.splice(destination.index, 0, removed);
          updatedPhases[sourcePhaseIndex] = {
            ...updatedPhases[sourcePhaseIndex],
            serviceItems: items,
          };
          onChange(updatedPhases);
        }
      } else {
        // Moving between containers
        let draggedItem: EngagementServiceItemFormData;
        
        if (sourcePhaseIndex === -1) {
          // Moving from unassigned
          draggedItem = unassignedServiceItems[source.index];
          const newUnassigned = unassignedServiceItems.filter((_, i) => i !== source.index);
          onServiceItemsChange(newUnassigned);
        } else {
          // Moving from a phase
          const sourcePhase = phases[sourcePhaseIndex];
          draggedItem = sourcePhase.serviceItems[source.index];
          const updatedPhases = [...phases];
          updatedPhases[sourcePhaseIndex] = {
            ...sourcePhase,
            serviceItems: sourcePhase.serviceItems.filter((_, i) => i !== source.index),
          };
          onChange(updatedPhases);
        }

        if (destPhaseIndex === -1) {
          // Moving to unassigned
          draggedItem.isAssigned = false;
          const newUnassigned = [...unassignedServiceItems];
          newUnassigned.splice(destination.index, 0, draggedItem);
          onServiceItemsChange(newUnassigned);
        } else {
          // Moving to a phase
          draggedItem.isAssigned = true;
          const updatedPhases = [...phases];
          const destItems = [...updatedPhases[destPhaseIndex].serviceItems];
          destItems.splice(destination.index, 0, draggedItem);
          updatedPhases[destPhaseIndex] = {
            ...updatedPhases[destPhaseIndex],
            serviceItems: destItems,
          };
          onChange(updatedPhases);
        }
      }
    }
  };

  const getPhaseId = (phase: EngagementPhaseFormData) => phase.tempId || phase.id?.toString() || '';

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack>
        <Group justify="space-between">
          <Text size="lg" fw={500}>Phases & Service Items</Text>
          {isNotStarted && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addPhase}
              variant="light"
            >
              Add Phase
            </Button>
          )}
        </Group>

        {/* Unassigned Service Items */}
        {unassignedServiceItems.length > 0 && (
          <Card withBorder>
            <Group mb="md" justify="space-between">
              <Group>
                <IconAlertCircle size={20} color="var(--mantine-color-orange-6)" />
                <Text fw={500}>Unassigned Service Items</Text>
                <Badge color="orange" variant="light">
                  {unassignedServiceItems.length}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Drag items to phases below
              </Text>
            </Group>
            
            <Droppable droppableId="unassigned" type="service-item">
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver 
                      ? 'var(--mantine-color-orange-0)' 
                      : undefined,
                    borderRadius: 'var(--mantine-radius-md)',
                    minHeight: 60,
                    padding: 8,
                    transition: 'background-color 0.2s',
                  }}
                >
                  {unassignedServiceItems.map((item, index) => (
                    <Draggable
                      key={item.engagementLetterServiceItemId}
                      draggableId={`unassigned-${item.engagementLetterServiceItemId}`}
                      index={index}
                      isDragDisabled={!isNotStarted}
                    >
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          withBorder
                          p="xs"
                          mb="xs"
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                          }}
                        >
                          <Group wrap="nowrap">
                            <IconGripVertical size={16} color="var(--mantine-color-gray-5)" />
                            <Box style={{ flex: 1 }}>
                              <Text size="sm" fw={500}>{item.serviceName}</Text>
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {item.serviceDescription}
                              </Text>
                            </Box>
                          </Group>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Card>
        )}

        {/* Phases */}
        <Droppable droppableId="phases" type="phase">
          {(provided) => (
            <Stack ref={provided.innerRef} {...provided.droppableProps}>
              {phases.map((phase, index) => {
                const phaseId = getPhaseId(phase);
                const isExpanded = expandedPhases.has(phaseId);
                const hasDateIssue = phase.phaseStartDate && phase.phaseEndDate && 
                  phase.phaseStartDate > phase.phaseEndDate;

                return (
                  <Draggable
                    key={phaseId}
                    draggableId={`phase-${phaseId}`}
                    index={index}
                    isDragDisabled={!isNotStarted}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        withBorder
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <Stack>
                          <Group justify="space-between" wrap="nowrap">
                            <Group wrap="nowrap" style={{ flex: 1 }}>
                              {isNotStarted && (
                                <Box {...provided.dragHandleProps}>
                                  <IconGripVertical size={20} color="var(--mantine-color-gray-5)" />
                                </Box>
                              )}
                              <ActionIcon
                                variant="subtle"
                                onClick={() => togglePhaseExpansion(phaseId)}
                              >
                                {isExpanded ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
                              </ActionIcon>
                              <TextInput
                                placeholder="Phase Name"
                                value={phase.phaseName}
                                onChange={(e) => updatePhase(index, { phaseName: e.target.value })}
                                disabled={!isNotStarted}
                                style={{ flex: 1 }}
                                error={!phase.phaseName && phase.serviceItems.length > 0}
                                required
                              />
                              <Badge variant="light" color={phase.serviceItems.length > 0 ? 'blue' : 'gray'}>
                                {phase.serviceItems.length} items
                              </Badge>
                            </Group>
                            {isNotStarted && (
                              <Tooltip label="Delete phase">
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  onClick={() => deletePhase(index)}
                                >
                                  <IconTrash size={20} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>

                          <Collapse in={isExpanded}>
                            <Stack>
                              <Divider />
                              
                              <Grid>
                                <Grid.Col span={12}>
                                  <Textarea
                                    label="Description"
                                    placeholder="Phase description"
                                    value={phase.phaseDescription || ''}
                                    onChange={(e) => updatePhase(index, { phaseDescription: e.target.value })}
                                    disabled={!isNotStarted}
                                    rows={2}
                                  />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                  <DateField
                                    label="Start Date"
                                    value={phase.phaseStartDate ? new Date(phase.phaseStartDate) : null}
                                    onChange={(date) => updatePhase(index, { phaseStartDate: date })}
                                    disabled={!isNotStarted}
                                    minDate={startDate || undefined}
                                    maxDate={endDate || undefined}
                                    error={hasDateIssue ? 'Start date must be before end date' : undefined}
                                  />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                  <DateField
                                    label="End Date"
                                    value={phase.phaseEndDate ? new Date(phase.phaseEndDate) : null}
                                    onChange={(date) => updatePhase(index, { phaseEndDate: date })}
                                    disabled={!isNotStarted}
                                    minDate={phase.phaseStartDate ? new Date(phase.phaseStartDate) : startDate || undefined}
                                    maxDate={endDate || undefined}
                                    error={hasDateIssue ? 'End date must be after start date' : undefined}
                                  />
                                </Grid.Col>
                              </Grid>

                              <Box>
                                <Text size="sm" fw={500} mb="xs">Service Items</Text>
                                <Droppable droppableId={`phase-${index}`} type="service-item">
                                  {(provided, snapshot) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={{
                                        backgroundColor: snapshot.isDraggingOver 
                                          ? 'var(--mantine-color-blue-0)' 
                                          : 'var(--mantine-color-gray-0)',
                                        borderRadius: 'var(--mantine-radius-md)',
                                        minHeight: 80,
                                        padding: 8,
                                        border: phase.serviceItems.length === 0 
                                          ? '2px dashed var(--mantine-color-gray-3)' 
                                          : undefined,
                                        transition: 'all 0.2s',
                                      }}
                                    >
                                      {phase.serviceItems.length === 0 && !snapshot.isDraggingOver && (
                                        <Text ta="center" c="dimmed" size="sm" py="md">
                                          Drag service items here
                                        </Text>
                                      )}
                                      {phase.serviceItems.map((item, itemIndex) => (
                                        <Draggable
                                          key={item.engagementLetterServiceItemId}
                                          draggableId={`phase-${index}-item-${item.engagementLetterServiceItemId}`}
                                          index={itemIndex}
                                          isDragDisabled={!isNotStarted}
                                        >
                                          {(provided, snapshot) => (
                                            <Paper
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              withBorder
                                              p="xs"
                                              mb="xs"
                                              style={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                              }}
                                            >
                                              <Group wrap="nowrap">
                                                <IconGripVertical size={16} color="var(--mantine-color-gray-5)" />
                                                <Box style={{ flex: 1 }}>
                                                  <Text size="sm" fw={500}>{item.serviceName}</Text>
                                                  <Text size="xs" c="dimmed" lineClamp={1}>
                                                    {item.serviceDescription}
                                                  </Text>
                                                </Box>
                                              </Group>
                                            </Paper>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </Box>
                                  )}
                                </Droppable>
                              </Box>
                            </Stack>
                          </Collapse>
                        </Stack>
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>

        {phases.length === 0 && (
          <Card withBorder p="xl">
            <Stack align="center">
              <Text c="dimmed">No phases created yet</Text>
              {isNotStarted && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={addPhase}
                  variant="light"
                >
                  Create First Phase
                </Button>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </DragDropContext>
  );
}