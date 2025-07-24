// SharePoint Configuration for VSTN CRM Documents
export const SHAREPOINT_CONFIG = {
  // https://graph.microsoft.com/v1.0/sites?search=vstn
  siteId: '3048f193-fd10-44ef-a2d5-990724706cdb', 
  driveId: 'b!k_FIMBD970Si1ZkHJHBs22VXBjg9cvpIlZHBownnA9J9bj_z_fEoQJvwK61YIDkE', 
  
  // Base paths in SharePoint
  basePaths: {
    customers: '/Customers',
    partners: '/Partners',
    internal: '/Internal',
  },
  
  // Folder structure templates
  folderStructure: {
    customer: (customerName: string, customerCode: string) => 
      `${customerName}_${customerCode}`,
    
    engagement: (engagementCode: string, engagementName: string) => 
      `${engagementCode}_${engagementName}`,
    
    subfolders: [
      '01_Proposal',
      '02_Engagement_Letter',
      '03_Working_Files',
      '04_Client_Deliverables',
      '05_Correspondence',
    ],
  },
  
  // Permission groups (M365 Groups)
  permissions: {
    adminGroup: 'VSTN_CRM_Admins',
    managerGroup: 'VSTN_CRM_Managers',
    consultantGroup: 'VSTN_CRM_Consultants',
  },
};

// Helper function to build SharePoint paths
export function buildSharePointPath(
  entityType: string,
  entityData: any
): string {
  switch (entityType) {
    case 'customer':
    case 'proposal':
    case 'engagement_letter':
    case 'engagement':
      return `${SHAREPOINT_CONFIG.basePaths.customers}/${
        SHAREPOINT_CONFIG.folderStructure.customer(
          entityData.customerName,
          entityData.customerCode
        )
      }`;
    
    case 'partner':
      return `${SHAREPOINT_CONFIG.basePaths.partners}/${
        entityData.partnerName
      }_${entityData.partnerCode}`;
    
    case 'employee':
      return `${SHAREPOINT_CONFIG.basePaths.internal}/Employee_Documents/${
        entityData.employeeName
      }_${entityData.employeeCode}`;
    
    default:
      return SHAREPOINT_CONFIG.basePaths.internal;
  }
}