import { useState } from 'react';
import { Tabs, rem } from '@mantine/core';
import { IconMail, IconCalendar } from '@tabler/icons-react';
import { EmailViewer } from './EmailViewer';
import { CalendarViewer } from './CalendarViewer';

interface OutlookTabsProps {
  entityType?: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId?: number;
  entityCode?: string;
  relatedCodes?: string[];
  defaultTab?: 'emails' | 'calendar';
}

export function OutlookTabs({
  entityType,
  entityId,
  entityCode,
  relatedCodes = [],
  defaultTab = 'emails'
}: OutlookTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
  
  return (
    <Tabs 
      value={activeTab} 
      onChange={setActiveTab}
      style={{ height: '100%' }}
    >
      <Tabs.List>
        <Tabs.Tab 
          value="emails" 
          leftSection={<IconMail style={{ width: rem(16), height: rem(16) }} />}
        >
          Emails
        </Tabs.Tab>
        <Tabs.Tab 
          value="calendar" 
          leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
        >
          Calendar
        </Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panel value="emails" pt="md" style={{ height: 'calc(100% - 42px)' }}>
        {activeTab === 'emails' && (
          <EmailViewer
            entityType={entityType}
            entityId={entityId}
            entityCode={entityCode}
            relatedCodes={relatedCodes}
          />
        )}
      </Tabs.Panel>
      
      <Tabs.Panel value="calendar" pt="md" style={{ height: 'calc(100% - 42px)' }}>
        {activeTab === 'calendar' && (
          <CalendarViewer
            entityType={entityType}
            entityId={entityId}
            entityCode={entityCode}
            relatedCodes={relatedCodes}
          />
        )}
      </Tabs.Panel>
    </Tabs>
  );
}