// Export all types
export * from './types';

// Export mappers
export { EmailMapper } from './mappers/email.mapper';
export { CalendarMapper } from './mappers/calendar.mapper';

// Export service interfaces
export type { IEmailService, ICalendarService } from './services/interfaces';

// Export service implementations
export { GraphEmailService } from './services/graph-email.service';
export { GraphCalendarService } from './services/graph-calendar.service';
export { BackendEmailService } from './services/backend-email.service';
export { BackendCalendarService } from './services/backend-calendar.service';

// Export factory and singleton
export { OutlookServiceFactory, outlookServices } from './services/service-factory';