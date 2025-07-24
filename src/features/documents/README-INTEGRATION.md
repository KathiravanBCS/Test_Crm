# SharePoint Integration Guide

## Overview
The document management system integrates with your SharePoint site at:
`https://vstnconsultancypvtltd-my.sharepoint.com/sites/VSTN_CRM_Documents/`

## How It Works

### 1. Upload Flow
When a user uploads a document:

```typescript
// 1. User uploads in proposal detail page
<DocumentListWidget
  entityType="proposal"
  entityId={123}
/>

// 2. Upload button clicked → DocumentUploadModal opens
// 3. User selects file and clicks Upload

// 4. Frontend requests upload session
const uploadSession = await api.documents.createUploadSession({
  entity_type: 'proposal',
  entity_id: 123,
  file_name: 'Contract.pdf',
  file_size: 1024000
});

// 5. Backend creates SharePoint folder structure:
// /Customers/ABC_Company_CUST001/PROP-2025-001_Annual_Audit/01_Proposal/

// 6. Frontend uploads directly to SharePoint
await fetch(uploadSession.uploadUrl, {
  method: 'PUT',
  body: file
});

// 7. Backend saves metadata in database
```

### 2. Download Flow
```typescript
// 1. User clicks download icon
// 2. document.download_url contains SharePoint direct download URL
// 3. Browser downloads file directly from SharePoint
window.open(document.download_url, '_blank');
```

### 3. Folder Structure Created
For a customer "ABC Company" with code "CUST001":
```
/Customers/
  └── ABC_Company_CUST001/
      └── PROP-2025-001_Annual_Audit_Proposal/
          ├── 01_Proposal/
          ├── 02_Engagement_Letter/
          ├── 03_Working_Files/
          ├── 04_Client_Deliverables/
          └── 05_Correspondence/
```

### 4. Permissions
- **Admin**: Full control over entire SharePoint site
- **Manager**: Edit rights on assigned engagement folders
- **Consultant**: 
  - Edit rights on `03_Working_Files`
  - Read-only on `01_Proposal` and `02_Engagement_Letter`

## Backend Requirements

Your FastAPI backend needs to implement these endpoints:

### 1. Create Upload Session
```python
@router.post("/documents/upload-session")
async def create_upload_session(
    entity_type: str,
    entity_id: int,
    file_name: str,
    file_size: int,
    current_user: User = Depends(get_current_user)
):
    # 1. Get entity details (customer name, code, etc.)
    # 2. Build SharePoint folder path
    # 3. Create folders if needed
    # 4. Get upload URL from SharePoint
    # 5. Return upload URL and session ID
```

### 2. Finalize Upload
```python
@router.post("/documents/upload-session/{session_id}/finalize")
async def finalize_upload(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    # 1. Get file metadata from SharePoint
    # 2. Save to database
    # 3. Return document metadata
```

### 3. Get Documents
```python
@router.get("/documents/{entity_type}/{entity_id}")
async def get_documents(
    entity_type: str,
    entity_id: int,
    filters: DocumentFilter = Depends()
):
    # 1. Query database for document metadata
    # 2. Include SharePoint URLs
    # 3. Return filtered results
```

## Database Schema
Add this table to track documents:

```sql
CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    sharepoint_item_id TEXT NOT NULL,
    sharepoint_drive_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size_kb INTEGER,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'draft',
    review_status TEXT,
    reviewed_by INTEGER REFERENCES employee_profile(id),
    reviewed_at TIMESTAMP,
    approval_notes TEXT,
    tags TEXT[],
    uploaded_by INTEGER REFERENCES employee_profile(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    web_url TEXT NOT NULL,
    download_url TEXT NOT NULL
);

CREATE TABLE document_activity (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES document(id),
    action TEXT NOT NULL,
    performed_by INTEGER REFERENCES employee_profile(id),
    performed_at TIMESTAMP DEFAULT NOW(),
    details JSONB
);
```

## Testing the Integration

1. **Get SharePoint IDs**: Use Graph Explorer to find your site ID and drive ID
2. **Update Config**: Update `sharepoint-config.ts` with actual IDs
3. **Test Upload**: Try uploading a small file first
4. **Check SharePoint**: Verify folder structure is created correctly
5. **Test Download**: Ensure download URLs work

## Common Issues

1. **Permission Errors**: Ensure app has SharePoint permissions:
   - Sites.ReadWrite.All
   - Files.ReadWrite.All

2. **Folder Creation**: Check if service account has rights to create folders

3. **Large Files**: Use upload session for files > 4MB

4. **CORS Issues**: Configure SharePoint to allow your domain