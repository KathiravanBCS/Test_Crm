import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Stack,
  Text,
  Select,
  Button,
  Group,
  Alert,
  Card,
  Badge,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { IconFileText, IconAlertCircle } from '@tabler/icons-react';
import { useGetEngagementLetters } from '@/features/engagement-letters/api/useGetEngagementLetters';
import { formatDate } from '@/lib/utils/date';
import type { EngagementLetter } from '@/features/engagement-letters/types';

interface SelectEngagementLetterModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SelectEngagementLetterModal({ opened, onClose }: SelectEngagementLetterModalProps) {
  const navigate = useNavigate();
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const { data: response, isLoading } = useGetEngagementLetters();
  const letters = response?.data || [];

  // Filter only approved engagement letters
  const approvedLetters = Array.isArray(letters) ? letters.filter(letter => 
    letter.status?.statusCode === 'approved' || letter.status?.statusName?.toLowerCase() === 'approved'
  ) : [];

  const selectData = approvedLetters.map(letter => ({
    value: letter.id.toString(),
    label: `${letter.engagementLetterCode} - ${letter.engagementLetterTitle}`,
    letter,
  }));

  const selectedLetter = approvedLetters.find(l => l.id.toString() === selectedLetterId);

  const handleContinue = () => {
    if (selectedLetterId) {
      navigate(`/engagements/new?engagementLetterId=${selectedLetterId}`);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Engagement Letter"
      size="lg"
    >
      <LoadingOverlay visible={isLoading} />
      
      <Stack>
        <Alert icon={<IconFileText size={20} />} color="blue" variant="light">
          To create a new engagement, you must select an approved engagement letter. 
          The engagement will inherit all service items from the selected letter.
        </Alert>

        {approvedLetters.length === 0 ? (
          <Alert icon={<IconAlertCircle size={20} />} color="red" variant="light">
            No approved engagement letters found. Please create and approve an engagement letter first.
          </Alert>
        ) : (
          <>
            <Select
              label="Engagement Letter"
              placeholder="Select an approved engagement letter"
              data={selectData}
              value={selectedLetterId}
              onChange={setSelectedLetterId}
              searchable
              required
              leftSection={<IconFileText size={16} />}
              description="Only approved engagement letters are shown"
            />

            {selectedLetter && (
              <Card withBorder>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={500}>{selectedLetter.engagementLetterTitle}</Text>
                    <Badge color="green" variant="light">Approved</Badge>
                  </Group>
                  
                  <Box>
                    <Text size="sm" c="dimmed">Customer</Text>
                    <Text size="sm">{selectedLetter.customer?.customerName || 'N/A'}</Text>
                  </Box>

                  {selectedLetter.partner && (
                    <Box>
                      <Text size="sm" c="dimmed">Partner</Text>
                      <Text size="sm">{selectedLetter.partner.partnerName}</Text>
                    </Box>
                  )}

                  <Box>
                    <Text size="sm" c="dimmed">Service Items</Text>
                    <Text size="sm">{selectedLetter.serviceItems?.length || 0} items</Text>
                  </Box>

                  {selectedLetter.approvalDate && (
                    <Box>
                      <Text size="sm" c="dimmed">Approved On</Text>
                      <Text size="sm">
                        {formatDate(selectedLetter.approvalDate)}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Card>
            )}
          </>
        )}

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedLetterId || approvedLetters.length === 0}
          >
            Continue
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}