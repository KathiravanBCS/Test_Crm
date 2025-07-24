import { useState } from 'react';
import { Card, Stack, Button, Code, Text, Group, Alert, Badge } from '@mantine/core';
import { outlookServices } from '@/services/graph';

export function SimpleGraphTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  
  // Test simplified email service
  const testSimpleEmails = async () => {
    setLoading('emails');
    try {
      const emailService = outlookServices.email();
      const response = await emailService.getRecentEmails({
        maxItems: 10
      });
      
      setResults((prev: any) => ({
        ...prev,
        emails: {
          success: true,
          count: response.emails.length,
          total: response.totalCount,
          hasMore: response.hasMore,
          emails: response.emails.map((e: any) => ({
            subject: e.subject,
            from: e.sender.email,
            date: e.receivedDateTime
          }))
        }
      }));
    } catch (error: any) {
      setResults((prev: any) => ({ 
        ...prev, 
        emails: { 
          error: error.message,
          details: error
        } 
      }));
    } finally {
      setLoading(null);
    }
  };
  
  // Test with entity code filter (client-side)
  const testFilteredEmails = async () => {
    setLoading('filteredEmails');
    try {
      const emailService = outlookServices.email();
      const response = await emailService.getRecentEmails({
        entityCode: 'PRTN-2024-001',
        maxItems: 10
      });
      
      setResults((prev: any) => ({
        ...prev,
        filteredEmails: {
          success: true,
          count: response.emails.length,
          total: response.totalCount,
          emails: response.emails.map((e: any) => ({
            subject: e.subject,
            from: e.sender.email,
            matched: e.relatedEntityCodes
          }))
        }
      }));
    } catch (error: any) {
      setResults((prev: any) => ({ 
        ...prev, 
        filteredEmails: { 
          error: error.message,
          details: error
        } 
      }));
    } finally {
      setLoading(null);
    }
  };
  
  // Test simplified calendar service
  const testSimpleCalendar = async () => {
    setLoading('calendar');
    try {
      const calendarService = outlookServices.calendar();
      const response = await calendarService.getRecentMeetings({
        maxItems: 10
      });
      
      setResults((prev: any) => ({
        ...prev,
        calendar: {
          success: true,
          count: response.events.length,
          total: response.totalCount,
          events: response.events.map((e: any) => ({
            subject: e.subject,
            start: e.startDateTime,
            end: e.endDateTime
          }))
        }
      }));
    } catch (error: any) {
      setResults((prev: any) => ({ 
        ...prev, 
        calendar: { 
          error: error.message,
          details: error
        } 
      }));
    } finally {
      setLoading(null);
    }
  };
  
  const isUsingBackend = outlookServices.isUsingBackend();
  
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600}>Simplified Graph API Test</Text>
          <Badge color={isUsingBackend ? 'yellow' : 'green'}>
            {isUsingBackend ? 'Using Backend' : 'Using Graph API'}
          </Badge>
        </Group>
        
        <Alert color="blue" title="About this test">
          This tests the simplified Graph services that fetch more data and filter client-side to avoid complex OData filters.
        </Alert>
        
        <Group>
          <Button 
            size="xs" 
            onClick={testSimpleEmails}
            loading={loading === 'emails'}
          >
            Get Recent Emails
          </Button>
          
          <Button 
            size="xs" 
            onClick={testFilteredEmails}
            loading={loading === 'filteredEmails'}
          >
            Get Filtered Emails (PRTN-2024-001)
          </Button>
          
          <Button 
            size="xs" 
            onClick={testSimpleCalendar}
            loading={loading === 'calendar'}
          >
            Get Calendar Events
          </Button>
        </Group>
        
        {Object.entries(results).map(([test, result]) => (
          <div key={test}>
            <Text size="sm" fw={600} mb="xs">{test}:</Text>
            <Code block style={{ maxHeight: 300, overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </Code>
          </div>
        ))}
      </Stack>
    </Card>
  );
}