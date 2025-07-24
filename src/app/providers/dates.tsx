import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/en';

interface AppDatesProviderProps {
  children: React.ReactNode;
}

/**
 * Global date configuration provider for Mantine date components.
 * 
 * Configuration:
 * - Locale: English
 * - First day of week: Monday
 * - Weekend days: Saturday and Sunday
 */
export function AppDatesProvider({ children }: AppDatesProviderProps) {
  return (
    <DatesProvider
      settings={{
        locale: 'en',
        firstDayOfWeek: 1, // Monday
        weekendDays: [0, 6], // Sunday and Saturday
        consistentWeeks: true, // Always show 6 weeks in calendar
      }}
    >
      {children}
    </DatesProvider>
  );
}