import { useState } from 'react';
import {
  Stack,
  Text,
  Group,
  Button,
  Textarea,
  Badge,
  Paper,
  Divider,
  Timeline,
  Alert,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconX,
  IconFile,
  IconEye,
  IconClock,
  IconUser,
} from '@tabler/icons-react';
import { useReviewDocument } from '../api/useReviewDocument';
import { DocumentMetadata, DocumentActivity } from '../types';
import { formatDateTime } from '@/lib/utils/date';
import { useGetDocumentActivities } from '../api/useGetDocumentActivities';

interface DocumentReviewModalProps {
  document: DocumentMetadata;
  onSuccess: () => void;
}

export function DocumentReviewModal({ document, onSuccess }: DocumentReviewModalProps) {
  const [previewLoading, setPreviewLoading] = useState(false);
  const reviewMutation = useReviewDocument();
  const { data: activities } = useGetDocumentActivities(document.id);

  const form = useForm({
    initialValues: {
      notes: '',
    },
  });

  const handleApprove = async () => {
    await reviewMutation.mutateAsync({
      documentId: document.id,
      action: 'approve',
      notes: form.values.notes,
    });
    onSuccess();
  };

  const handleReject = async () => {
    if (!form.values.notes) {
      form.setFieldError('notes', 'Please provide a reason for rejection');
      return;
    }
    
    await reviewMutation.mutateAsync({
      documentId: document.id,
      action: 'reject',
      notes: form.values.notes,
    });
    onSuccess();
  };

  const handlePreview = () => {
    setPreviewLoading(true);
    window.open(document.webUrl, '_blank');
    setTimeout(() => setPreviewLoading(false), 1000);
  };

  const reviewActivities = activities?.filter(
    activity => activity.action === 'reviewed' || activity.action === 'approved' || activity.action === 'rejected'
  );

  return (
    <Stack gap="md">
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <IconFile size={20} />
            <Text fw={500}>{document.fileName}</Text>
          </Group>
          <Badge color={document.status === 'approved' ? 'green' : 'yellow'}>
            {document.reviewStatus || document.status}
          </Badge>
        </Group>

        <Stack gap="xs">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Uploaded by:</Text>
            <Text size="sm">
              {document.uploadedBy.firstName} {document.uploadedBy.lastName}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">Upload date:</Text>
            <Text size="sm">{formatDateTime(document.uploadedAt)}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">File size:</Text>
            <Text size="sm">{(document.fileSizeKb / 1024).toFixed(2)} MB</Text>
          </Group>
          {document.tags && document.tags.length > 0 && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">Tags:</Text>
              <Group gap={4}>
                {document.tags.map((tag, index) => (
                  <Badge key={index} size="sm" variant="light">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Group>
          )}
        </Stack>

        <Group mt="md">
          <Button
            variant="default"
            leftSection={<IconEye size={16} />}
            onClick={handlePreview}
            loading={previewLoading}
          >
            Preview Document
          </Button>
        </Group>
      </Paper>

      <Divider />

      {reviewActivities && reviewActivities.length > 0 && (
        <>
          <Text fw={500}>Review History</Text>
          <Timeline bulletSize={24} lineWidth={2}>
            {reviewActivities.map((activity) => (
              <Timeline.Item
                key={activity.id}
                bullet={<IconClock size={12} />}
                title={
                  <Group gap="xs">
                    <Text size="sm">
                      {activity.performedBy.firstName} {activity.performedBy.lastName}
                    </Text>
                    <Badge size="xs" color={activity.action === 'approved' ? 'green' : 'red'}>
                      {activity.action}
                    </Badge>
                  </Group>
                }
              >
                <Text size="xs" c="dimmed">
                  {formatDateTime(activity.performedAt)}
                </Text>
                {activity.details?.notes && (
                  <Text size="sm" mt={4}>
                    {activity.details.notes}
                  </Text>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
          <Divider />
        </>
      )}

      <Alert icon={<IconUser size={16} />} variant="light">
        You are reviewing this document as a {document.reviewStatus === 'pending' ? 'reviewer' : 'viewer'}.
        {document.reviewStatus === 'pending' && ' Your decision will be recorded in the audit log.'}
      </Alert>

      <Textarea
        label="Review Notes"
        placeholder="Add your review comments or reason for decision..."
        rows={4}
        {...form.getInputProps('notes')}
      />

      <Group justify="flex-end">
        <Button
          color="red"
          leftSection={<IconX size={16} />}
          onClick={handleReject}
          loading={reviewMutation.isPending}
        >
          Reject
        </Button>
        <Button
          color="green"
          leftSection={<IconCheck size={16} />}
          onClick={handleApprove}
          loading={reviewMutation.isPending}
        >
          Approve
        </Button>
      </Group>
    </Stack>
  );
}