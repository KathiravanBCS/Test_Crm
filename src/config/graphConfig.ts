// Microsoft Graph API configuration
export const graphScopes = {
  // Your existing backend API scope
  api: ['api://525d427d-09c6-4922-b9b6-0086c3424a73/user'],
  
  // Microsoft Graph scopes
  graph: {
    default: ['User.Read'],
    email: ['Mail.Read', 'Mail.ReadBasic'],
    calendar: ['Calendars.Read', 'Calendars.ReadBasic'],
  },
  
  // Combined scopes for login - includes both your API and Graph scopes
  loginRequest: [
    'api://525d427d-09c6-4922-b9b6-0086c3424a73/user',
    'User.Read',
    'Mail.Read',
    'Mail.ReadBasic', 
    'Calendars.Read',
    'Calendars.ReadBasic'
  ]
};

export const graphEndpoints = {
  me: 'https://graph.microsoft.com/v1.0/me',
  messages: 'https://graph.microsoft.com/v1.0/me/messages',
  events: 'https://graph.microsoft.com/v1.0/me/events',
  mailFolders: 'https://graph.microsoft.com/v1.0/me/mailFolders',
  calendar: 'https://graph.microsoft.com/v1.0/me/calendar',
  calendarView: 'https://graph.microsoft.com/v1.0/me/calendarView',
};