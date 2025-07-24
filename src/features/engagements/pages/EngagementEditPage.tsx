import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Card,
  Group,
  Text,
  Button,
  TextInput,
  Select,
  Grid,
  Alert,
  Badge,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  Box,
  Divider,
  Paper,
  Stepper,
  rem,
} from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconBriefcase,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconFileText,
  IconListCheck,
  IconCircleCheck,
  IconArrowLeft,
  IconDeviceFloppy,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { PhaseManagerDetailed } from '../components/PhaseManagerDetailed';
import { useGetEngagementLetter } from '../../engagement-letters/api/useGetEngagementLetter';
import { useGetEmployees } from '@/lib/hooks/useGetEmployees';
import type { EngagementFormData, EngagementPhaseFormData, EngagementServiceItemFormData } from '../types';
import type { EngagementLetter, EngagementLetterServiceItem } from '../../engagement-letters/types';
import { formatDate } from '@/lib/utils/date';
import type { EmployeeProfile } from '@/types';

// Helper function to safely format dates
function formatDateLocal(date: Date | string | null | undefined): string {
  return formatDate(date) || 'Not set';
}


export function EngagementEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [unassignedServiceItems, setUnassignedServiceItems] = useState<EngagementServiceItemFormData[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const isNewEngagement = !id || id === 'new';
  const isNotStarted = true; // For new engagements or those in 'not_started' status
  
  // Get engagement letter ID from query params
  const [searchParams] = useSearchParams();
  const engagementLetterId = searchParams.get('engagementLetterId');
  const { data: engagementLetter, isLoading: isLoadingLetter } = useGetEngagementLetter(
    engagementLetterId ? parseInt(engagementLetterId) : undefined
  );
  const { data: employees = [], isLoading: isLoadingEmployees } = useGetEmployees();

  const form = useForm<EngagementFormData>({
    initialValues: {
      engagementName: '',
      engagementLetterId: 0,
      managerId: undefined,
      startDate: null,
      endDate: null,
      phases: [],
    },
    validate: {
      engagementName: (value) => !value ? 'Engagement name is required' : null,
      engagementLetterId: (value) => !value ? 'Please select an engagement letter' : null,
      startDate: (value, values) => {
        if (!value) return 'Start date is required';
        if (values.endDate && value > values.endDate) return 'Start date must be before end date';
        return null;
      },
      endDate: (value, values) => {
        if (!value) return 'End date is required';
        if (values.startDate && value < values.startDate) return 'End date must be after start date';
        return null;
      },
      phases: {
        phaseName: (value) => !value ? 'Phase name is required' : null,
      },
    },
  });

  // Load engagement letter and initialize form
  useEffect(() => {
    if (isNewEngagement && engagementLetter) {
      // Initialize form with engagement letter data
      form.setValues({
        engagementName: engagementLetter.engagementLetterTitle,
        engagementLetterId: engagementLetter.id,
        managerId: undefined,
        startDate: null,
        endDate: null,
        phases: [],
      });

      // Convert service items to unassigned items
      const unassigned = engagementLetter.serviceItems?.map(item => ({
        engagementLetterServiceItemId: item.id,
        serviceName: item.serviceName,
        serviceDescription: item.serviceDescription,
        isAssigned: false,
      })) || [];
      setUnassignedServiceItems(unassigned);
    } else if (!isNewEngagement) {
      // Load existing engagement
      // TODO: Fetch engagement by ID using useGetEngagement hook
    }
  }, [engagementLetter, isNewEngagement]);

  const handleSubmit = form.onSubmit((values) => {
    // Check if all service items are assigned
    if (unassignedServiceItems.length > 0) {
      notifications.show({
        title: 'Unassigned Service Items',
        message: 'All service items must be assigned to phases before saving',
        color: 'red',
        icon: <IconAlertCircle />,
      });
      return;
    }

    // Validate phases have names
    const invalidPhases = values.phases.filter(phase => !phase.phaseName);
    if (invalidPhases.length > 0) {
      notifications.show({
        title: 'Invalid Phases',
        message: 'All phases must have names',
        color: 'red',
        icon: <IconAlertCircle />,
      });
      return;
    }

    setLoading(true);
    // In real app, call API to save engagement
    console.log('Saving engagement:', values);
    
    setTimeout(() => {
      setLoading(false);
      notifications.show({
        title: 'Success',
        message: 'Engagement saved successfully',
        color: 'green',
        icon: <IconCircleCheck />,
      });
      navigate('/engagements');
    }, 1000);
  });

  const handleStartEngagement = () => {
    // Additional validation for starting engagement
    if (!form.values.managerId) {
      notifications.show({
        title: 'Manager Required',
        message: 'Please assign a manager before starting the engagement',
        color: 'red',
        icon: <IconAlertCircle />,
      });
      return;
    }

    // Set baseline dates
    const updatedPhases = form.values.phases.map(phase => ({
      ...phase,
      baselineStartDate: phase.phaseStartDate,
      baselineEndDate: phase.phaseEndDate,
    }));

    form.setFieldValue('phases', updatedPhases);
    
    // Then submit with status change
    handleSubmit();
  };

  const managerOptions = employees
    .filter(emp => emp.role === 'Manager')
    .map(emp => ({
      value: emp.id.toString(),
      label: emp.name,
    }));

  if (isLoadingLetter || isLoadingEmployees) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h={400}>
          <LoadingOverlay visible />
          <Text>Loading engagement details...</Text>
        </Stack>
      </Container>
    );
  }

  if (!engagementLetter && isNewEngagement) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle />}
          title="Engagement Letter Required"
          color="red"
        >
          Please select an approved engagement letter to create an engagement
          <Button
            mt="md"
            variant="light"
            onClick={() => navigate('/engagements')}
          >
            Back to Engagements
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Stack>
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Breadcrumbs>
              <Anchor onClick={() => navigate('/engagements')} c="dimmed">
                Engagements
              </Anchor>
              <Text>{isNewEngagement ? 'New Engagement' : 'Edit Engagement'}</Text>
            </Breadcrumbs>
            <Text size="xl" fw={600} mt="xs">
              {isNewEngagement ? 'Create New Engagement' : 'Edit Engagement'}
            </Text>
          </Box>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/engagements')}
          >
            Back to List
          </Button>
        </Group>

        {/* Engagement Letter Info */}
        {engagementLetter && (
          <Card withBorder>
            <Group justify="space-between">
              <Box>
                <Group>
                  <IconFileText size={20} />
                  <Text fw={500}>Engagement Letter</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="xs">
                  {engagementLetter.engagementLetterCode} - {engagementLetter.engagementLetterTitle}
                </Text>
              </Box>
              <Stack gap="xs" align="flex-end">
                <Badge color="green" variant="light">Approved</Badge>
                <Text size="xs" c="dimmed">
                  Customer: {engagementLetter.customer?.customerName}
                </Text>
              </Stack>
            </Group>
          </Card>
        )}

        {/* Progress Steps */}
        <Card withBorder>
          <Stepper active={activeStep} onStepClick={setActiveStep}>
            <Stepper.Step
              label="Basic Information"
              description="Name, dates, and manager"
              icon={<IconBriefcase style={{ width: rem(18), height: rem(18) }} />}
            />
            <Stepper.Step
              label="Phases & Service Items"
              description="Organize work into phases"
              icon={<IconListCheck style={{ width: rem(18), height: rem(18) }} />}
            />
            <Stepper.Step
              label="Review & Save"
              description="Review and create engagement"
              icon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
            />
          </Stepper>
        </Card>

        <form onSubmit={handleSubmit}>
          <Stack>
            {/* Step 1: Basic Information */}
            {activeStep === 0 && (
              <Card withBorder>
                <Stack>
                  <Text size="lg" fw={500}>Basic Information</Text>
                  <Divider />
                  
                  <Grid>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Engagement Name"
                        placeholder="Enter engagement name"
                        required
                        {...form.getInputProps('engagementName')}
                        leftSection={<IconBriefcase size={16} />}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DateField
                        label="Start Date"
                        placeholder="Select start date"
                        required
                        value={form.values.startDate}
                        onChange={(value) => form.setFieldValue('startDate', value)}
                        error={form.errors.startDate}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DateField
                        label="End Date"
                        placeholder="Select end date"
                        required
                        value={form.values.endDate}
                        onChange={(value) => form.setFieldValue('endDate', value)}
                        error={form.errors.endDate}
                        minDate={form.values.startDate || undefined}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Engagement Manager"
                        placeholder="Select manager (optional for now)"
                        data={managerOptions}
                        {...form.getInputProps('managerId')}
                        leftSection={<IconUser size={16} />}
                        searchable
                        clearable
                      />
                    </Grid.Col>
                  </Grid>

                  <Group justify="flex-end" mt="md">
                    <Button
                      onClick={() => setActiveStep(1)}
                      disabled={!form.values.engagementName || !form.values.startDate || !form.values.endDate}
                    >
                      Next: Phases & Service Items
                    </Button>
                  </Group>
                </Stack>
              </Card>
            )}

            {/* Step 2: Phases & Service Items */}
            {activeStep === 1 && (
              <PhaseManagerDetailed
                phases={form.values.phases}
                onChange={(phases) => form.setFieldValue('phases', phases)}
                unassignedServiceItems={unassignedServiceItems}
                onServiceItemsChange={setUnassignedServiceItems}
                isNotStarted={isNotStarted}
                startDate={form.values.startDate}
                endDate={form.values.endDate}
                employees={employees}
              />
            )}

            {/* Step 3: Review & Save */}
            {activeStep === 2 && (
              <Card withBorder>
                <Stack>
                  <Text size="lg" fw={500}>Review Engagement</Text>
                  <Divider />
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Paper p="md" withBorder>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">Engagement Name</Text>
                          <Text>{form.values.engagementName}</Text>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Paper p="md" withBorder>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">Start Date</Text>
                          <Text>{formatDateLocal(form.values.startDate)}</Text>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Paper p="md" withBorder>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">End Date</Text>
                          <Text>{formatDateLocal(form.values.endDate)}</Text>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper p="md" withBorder>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">Manager</Text>
                          <Text>
                            {form.values.managerId 
                              ? employees.find(e => e.id === Number(form.values.managerId))?.name
                              : 'Not assigned'}
                          </Text>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper p="md" withBorder>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">Phases</Text>
                          <Group>
                            <Text>{form.values.phases.length} phases</Text>
                            <Badge variant="light" color="blue">
                              {form.values.phases.reduce((sum, phase) => sum + phase.serviceItems.length, 0)} service items
                            </Badge>
                          </Group>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                  </Grid>

                  {/* Phases Summary */}
                  <Box>
                    <Text size="sm" fw={500} mb="xs">Phases Summary</Text>
                    <Stack gap="xs">
                      {form.values.phases.map((phase, index) => (
                        <Paper key={phase.tempId || phase.id} p="sm" withBorder>
                          <Group justify="space-between">
                            <Box>
                              <Text fw={500}>{phase.phaseName || `Phase ${index + 1}`}</Text>
                              <Text size="xs" c="dimmed">
                                {formatDateLocal(phase.phaseStartDate)} - 
                                {formatDateLocal(phase.phaseEndDate)}
                              </Text>
                            </Box>
                            <Badge variant="light">
                              {phase.serviceItems.length} items
                            </Badge>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>

                  {unassignedServiceItems.length > 0 && (
                    <Alert
                      icon={<IconAlertCircle />}
                      title="Unassigned Service Items"
                      color="red"
                    >
                      {unassignedServiceItems.length} service items are not assigned to any phase. 
                      Please go back and assign all items before saving.
                    </Alert>
                  )}
                </Stack>
              </Card>
            )}

            {/* Action Buttons */}
            <Group justify="space-between">
              <Button
                variant="subtle"
                onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                disabled={activeStep === 0}
              >
                Previous
              </Button>
              
              <Group>
                {activeStep < 2 ? (
                  <Button
                    onClick={() => setActiveStep(activeStep + 1)}
                    disabled={
                      (activeStep === 0 && (!form.values.engagementName || !form.values.startDate || !form.values.endDate)) ||
                      (activeStep === 1 && (form.values.phases.length === 0 || unassignedServiceItems.length > 0))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      variant="light"
                      leftSection={<IconDeviceFloppy size={16} />}
                      disabled={unassignedServiceItems.length > 0}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      onClick={handleStartEngagement}
                      leftSection={<IconPlayerPlay size={16} />}
                      disabled={unassignedServiceItems.length > 0 || !form.values.managerId}
                    >
                      Save & Start Engagement
                    </Button>
                  </>
                )}
              </Group>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}