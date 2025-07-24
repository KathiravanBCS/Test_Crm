import { Stack, Card, Group, Text, Badge, ActionIcon, Anchor } from '@mantine/core';
import { 
  IconFile, 
  IconPdf, 
  IconFileSpreadsheet, 
  IconFileText,
  IconExternalLink,
  IconDownload,
} from '@tabler/icons-react';
import { EmptyState } from '@/components/display/EmptyState';
import { formatDate } from '@/lib/utils/date';
import { useQuery } from '@tanstack/react-query';

interface DocumentsListProps {
  entityType: string;
  entityId: number;
}

// Mock data for now
const mockDocuments = [
  {
    id: 1,
    fileName: 'Company Registration Certificate.pdf',
    fileType: 'application/pdf',
    fileSizeKb: 256,
    uploadedAt: new Date('2024-01-10'),
    uploadedBy: 'Priya Sharma',
    locationUrl: 'https://sharepoint.com/doc1',
  },
  {
    id: 2,
    fileName: 'GSTIN Certificate.pdf',
    fileType: 'application/pdf',
    fileSizeKb: 128,
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'Amit Patel',
    locationUrl: 'https://sharepoint.com/doc2',
  },
];

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return IconPdf;
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return IconFileSpreadsheet;
  if (fileType.includes('word') || fileType.includes('document')) return IconFileText;
  return IconFile;
};

const formatFileSize = (sizeKb: number) => {
  if (sizeKb < 1024) return `${sizeKb} KB`;
  return `${(sizeKb / 1024).toFixed(1)} MB`;
};

export function DocumentsList({ entityType, entityId }: DocumentsListProps) {
  // TODO: Replace with actual API call
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [entityType, entityId, 'documents'],
    queryFn: async () => mockDocuments,
  });

  if (!isLoading && documents.length === 0) {
    return (
      <EmptyState
        icon={<IconFile size={40} />}
        title="No documents"
        description="Documents linked from SharePoint will appear here"
        height={200}
      />
    );
  }

  return (
    <Stack gap="sm">
      {documents.map((doc) => {
        const FileIcon = getFileIcon(doc.fileType);
        
        return (
          <Card key={doc.id} withBorder p="sm">
            <Group justify="space-between" align="flex-start">
              <Group gap="sm">
                <FileIcon size={24} stroke={1.5} />
                <div>
                  <Text fw={500} size="sm">{doc.fileName}</Text>
                  <Group gap="xs" mt={4}>
                    <Badge size="xs" variant="light">
                      {formatFileSize(doc.fileSizeKb)}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedAt)}
                    </Text>
                  </Group>
                </div>
              </Group>

              <Group gap="xs">
                <ActionIcon 
                  variant="subtle"
                  component="a"
                  href={doc.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconExternalLink size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}