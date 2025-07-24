# Document Management System

A comprehensive SharePoint-integrated document management system for VSTN CRM, providing upload, review, approval, and sharing capabilities.

## Features

- **SharePoint Integration**: All documents stored in SharePoint with proper folder structure
- **Document Lifecycle**: Draft → Review → Approve/Reject → Archive workflow
- **Role-Based Access**: Different permissions for Admin, Manager, and Consultant roles
- **Version Control**: Track document versions through SharePoint
- **Activity Tracking**: Complete audit trail of all document actions
- **Contextual Documents**: Attach to any entity (proposal, engagement, etc.)

## Components

### DocumentListWidget
Main component for displaying and managing documents.

```tsx
import { DocumentListWidget } from '@/features/documents/components';

<DocumentListWidget
  entityType="proposal"
  entityId={proposalId}
  title="Proposal Documents"
  maxHeight={400}
  showUpload={true}
  showFilters={true}
  onDocumentClick={(document) => console.log(document)}
/>
```

### DocumentSummaryWidget
Compact summary showing document statistics.

```tsx
import { DocumentSummaryWidget } from '@/features/documents/components';

<DocumentSummaryWidget
  entityType="engagement"
  entityId={engagementId}
  title="Document Overview"
/>
```

### DocumentViewer
Modal for viewing document details and activity history.

```tsx
import { DocumentViewer } from '@/features/documents/components';

const [document, setDocument] = useState(null);
const [opened, setOpened] = useState(false);

<DocumentViewer
  document={document}
  opened={opened}
  onClose={() => setOpened(false)}
/>
```

## SharePoint Folder Structure

Documents are organized in SharePoint following this structure:

```
/Documents/
├── Customers/
│   └── {Customer_Name}_{Customer_Code}/
│       └── {Engagement_Code}_{Engagement_Name}/
│           ├── 01_Proposal/
│           ├── 02_Engagement_Letter/
│           ├── 03_Working_Files/
│           ├── 04_Client_Deliverables/
│           └── 05_Correspondence/
├── Partners/
│   └── {Partner_Name}_{Partner_Code}/
└── Internal/
    └── Employee_Documents/
```

## Permissions

- **Admin**: Full control over all documents
- **Manager**: 
  - Edit rights on assigned engagements
  - Can review and approve documents
- **Consultant**: 
  - Edit rights on Working Files folder
  - Read-only access to Proposals and Engagement Letters

## Document Workflow

1. **Upload**: Direct upload to SharePoint with metadata
2. **Review**: Managers can review pending documents
3. **Approval**: Approve or reject with notes
4. **Share**: Share via SharePoint with specific permissions
5. **Archive**: Move old documents to archived status

## API Integration

The system uses the existing MS Graph API integration:

```typescript
// Upload flow
1. Frontend requests upload URL from backend
2. Backend creates SharePoint folder if needed
3. Backend returns secure upload URL
4. Frontend uploads directly to SharePoint
5. Backend saves metadata in database

// Review flow
1. Manager reviews document in SharePoint
2. Approval/rejection saved in database
3. Activity logged for audit trail
```

## Usage in Different Contexts

### Proposal Documents
```tsx
<DocumentListWidget
  entityType="proposal"
  entityId={proposalId}
  title="Proposal Documents"
/>
```

### Engagement Letter Documents
```tsx
<DocumentListWidget
  entityType="engagement_letter"
  entityId={engagementLetterId}
  title="Contract Documents"
  showUpload={isManager}
/>
```

### Service Item Deliverables
```tsx
<DocumentListWidget
  entityType="engagement_service_item"
  entityId={serviceItemId}
  title="Deliverables"
  maxHeight={300}
/>
```

## Best Practices

1. **Always specify entity context** when uploading documents
2. **Use tags** to categorize documents for easy filtering
3. **Add descriptions** to documents for better searchability
4. **Review promptly** to maintain workflow efficiency
5. **Set expiration dates** when sharing sensitive documents