import { useState } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  FileInput,
  Button,
  Group,
  Text,
  TagsInput,
  Alert,
  Progress,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconFile, IconAlertCircle } from '@tabler/icons-react';
import { useUploadDocument } from '../api/useUploadDocument';
import { DocumentMetadata } from '../types';

interface DocumentUploadModalProps {
  entityType: DocumentMetadata['entityType'];
  entityId: number;
  onSuccess: () => void;
}

interface FormValues {
  file: File | null;
  description: string;
  tags: string[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentUploadModal({
  entityType,
  entityId,
  onSuccess,
}: DocumentUploadModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadDocument();

  const form = useForm<FormValues>({
    initialValues: {
      file: null,
      description: '',
      tags: [],
    },
    validate: {
      file: (value) => {
        if (!value) return 'Please select a file';
        if (value.size > MAX_FILE_SIZE) return 'File size must be less than 10MB';
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!values.file) return;

    try {
      setUploadProgress(20);
      await uploadMutation.mutateAsync({
        entityType: entityType,
        entityId: entityId,
        file: values.file,
        description: values.description,
        tags: values.tags,
      });
      setUploadProgress(100);
      onSuccess();
    } catch (error) {
      setUploadProgress(0);
    }
  };

  const getAcceptedFileTypes = () => {
    return {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    };
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Alert icon={<IconAlertCircle size={16} />} variant="light">
          Files will be uploaded to SharePoint and linked to this {entityType.replace('_', ' ')}.
        </Alert>

        <FileInput
          label="Select File"
          placeholder="Click to select file"
          leftSection={<IconFile size={16} />}
          accept={Object.values(getAcceptedFileTypes()).flat().join(',')}
          {...form.getInputProps('file')}
          required
        />

        {form.values.file && (
          <Text size="sm" c="dimmed">
            Selected: {form.values.file.name} ({(form.values.file.size / 1024 / 1024).toFixed(2)} MB)
          </Text>
        )}

        <Textarea
          label="Description"
          placeholder="Add a description for this document"
          rows={3}
          {...form.getInputProps('description')}
        />

        <TagsInput
          label="Tags"
          placeholder="Add tags (press Enter)"
          {...form.getInputProps('tags')}
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Progress value={uploadProgress} animated />
        )}

        <Group justify="flex-end">
          <Button
            type="submit"
            leftSection={<IconUpload size={16} />}
            loading={uploadMutation.isPending}
            disabled={!form.values.file}
          >
            Upload
          </Button>
        </Group>
      </Stack>
    </form>
  );
}