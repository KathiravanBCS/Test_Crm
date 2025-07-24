export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    permissions: '/auth/permissions',
  },

  // Customers
  customers: {
    list: '/customers',
    get: (id: number) => `/customers/${id}`,
    create: '/customers',
    update: (id: number) => `/customers/${id}`,
    delete: (id: number) => `/customers/${id}`,
    contacts: {
      list: (customerId: number) => `/customers/${customerId}/contacts`,
      create: (customerId: number) => `/customers/${customerId}/contacts`,
      update: (contactId: number) => `/contacts/${contactId}`,
      delete: (contactId: number) => `/contacts/${contactId}`,
    },
  },

  // Partners
  partners: {
    list: '/partners',
    get: (id: number) => `/partners/${id}`,
    create: '/partners',
    update: (id: number) => `/partners/${id}`,
    delete: (id: number) => `/partners/${id}`,
  },

  // Commissions
  commissions: {
    list: '/commissions',
    create: '/commissions',
    update: (id: number) => `/commissions/${id}`,
  },

  // Proposals
  proposals: {
    list: '/proposals',
    get: (id: number) => `/proposals/${id}`,
    create: '/proposals',
    update: (id: number) => `/proposals/${id}`,
    delete: (id: number) => `/proposals/${id}`,
    approve: (id: number) => `/proposals/${id}/approve`,
    reject: (id: number) => `/proposals/${id}/reject`,
    createEngagementLetter: (id: number) => `/proposals/${id}/create-engagement-letter`,
  },

  // Engagement Letters
  engagementLetters: {
    list: '/engagement-letters',
    get: (id: number) => `/engagement-letters/${id}`,
    create: '/engagement-letters',
    update: (id: number) => `/engagement-letters/${id}`,
    delete: (id: number) => `/engagement-letters/${id}`,
    approve: (id: number) => `/engagement-letters/${id}/approve`,
    reject: (id: number) => `/engagement-letters/${id}/reject`,
    sendForApproval: (id: number) => `/engagement-letters/${id}/send-for-approval`,
  },

  // Engagements
  engagements: {
    list: '/engagements',
    get: (id: number) => `/engagements/${id}`,
    create: '/engagements',
    update: (id: number) => `/engagements/${id}`,
    delete: (id: number) => `/engagements/${id}`,
    start: (id: number) => `/engagements/${id}/start`,
    pause: (id: number) => `/engagements/${id}/pause`,
    complete: (id: number) => `/engagements/${id}/complete`,
    updateStatus: (id: number) => `/engagements/${id}/status`,
    updateProgress: (id: number) => `/engagements/${id}/progress`,
    
    // Phases
    phases: {
      list: (engagementId: number) => `/engagements/${engagementId}/phases`,
      get: (engagementId: number, phaseId: number) => `/engagements/${engagementId}/phases/${phaseId}`,
      create: (engagementId: number) => `/engagements/${engagementId}/phases`,
      update: (engagementId: number, phaseId: number) => `/engagements/${engagementId}/phases/${phaseId}`,
      delete: (engagementId: number, phaseId: number) => `/engagements/${engagementId}/phases/${phaseId}`,
    },
    
    // Service Items
    serviceItems: {
      list: (engagementId: number, phaseId: number) => `/engagements/${engagementId}/phases/${phaseId}/service-items`,
      get: (engagementId: number, phaseId: number, itemId: number) => `/engagements/${engagementId}/phases/${phaseId}/service-items/${itemId}`,
      update: (engagementId: number, phaseId: number, itemId: number) => `/engagements/${engagementId}/phases/${phaseId}/service-items/${itemId}`,
      assign: (engagementId: number, phaseId: number, itemId: number) => `/engagements/${engagementId}/phases/${phaseId}/service-items/${itemId}/assign`,
    },
  },

  // Employees
  employees: {
    list: '/employees',
    get: (id: number) => `/employees/${id}`,
    create: '/employees',
    update: (id: number) => `/employees/${id}`,
    delete: (id: number) => `/employees/${id}`,
  },

  // Tasks
  tasks: {
    list: '/tasks',
    get: (id: number) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: number) => `/tasks/${id}`,
    delete: (id: number) => `/tasks/${id}`,
    approve: (id: number) => `/tasks/${id}/approve`,
  },

  // Service Items
  serviceItems: {
    list: '/service-items',
    get: (id: number) => `/service-items/${id}`,
    create: '/service-items',
    update: (id: number) => `/service-items/${id}`,
    delete: (id: number) => `/service-items/${id}`,
    active: '/service-items/active',
    byCategory: (category: string) => `/service-items/category/${category}`,
  },

  // Master Data
  masters: {
    statuses: '/master/statuses',
    statusesByContext: (context: string) => `/master/statuses?context=${context}`,
    services: '/master/services',
    servicesByCategory: (category: string) => `/master/services?category=${category}`,
    currencies: '/master/currencies',
    baseCurrency: '/master/currencies/base',
    branches: '/master/branches',
    exchangeRate: '/master/exchange-rate',
    updateStatus: (id: number) => `/master/statuses/${id}`,
    updateService: (id: number) => `/master/services/${id}`,
  },

  // Comments
  comments: {
    list: (entityType: string, entityId: number) => `/comments/${entityType}/${entityId}`,
    create: '/comments',
    update: (id: number) => `/comments/${id}`,
    delete: (id: number) => `/comments/${id}`,
  },

  // Documents
  documents: {
    list: (entityType: string, entityId: number) => `/documents/${entityType}/${entityId}`,
    get: (id: number) => `/documents/${id}`,
    createUploadSession: '/documents/upload-session',
    finalizeUpload: (sessionId: string) => `/documents/upload-session/${sessionId}/finalize`,
    download: (id: number) => `/documents/${id}/download`,
    delete: (id: number) => `/documents/${id}`,
    review: (id: number) => `/documents/${id}/review`,
    share: (id: number) => `/documents/${id}/share`,
    activities: (id: number) => `/documents/${id}/activities`,
    permissions: (id: number) => `/documents/${id}/permissions`,
  },
};