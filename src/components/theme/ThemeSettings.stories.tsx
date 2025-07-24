import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSettings } from './ThemeSettings';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MantineProvider } from '@mantine/core';

const meta: Meta<typeof ThemeSettings> = {
  title: 'UI/ThemeSettings',
  component: ThemeSettings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ minWidth: 400 }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InCard: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ 
            padding: 20, 
            background: '#f8f9fa', 
            borderRadius: 8,
            minWidth: 500 
          }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider forceColorScheme="dark">
          <div style={{ 
            minWidth: 400,
            padding: 20,
            background: '#1a1b1e',
            borderRadius: 8
          }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const InModal: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{
            width: 500,
            maxHeight: 600,
            overflowY: 'auto',
            padding: 20,
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Appearance Settings</h2>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ padding: 16 }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const WithCustomTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider theme={{ 
          primaryColor: 'grape',
          primaryShade: 6
        }}>
          <div style={{ minWidth: 400 }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const InSettingsPage: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ 
            background: '#f8f9fa', 
            minHeight: '100vh',
            padding: 40
          }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <h1 style={{ marginBottom: 8 }}>Settings</h1>
              <p style={{ color: '#666', marginBottom: 32 }}>
                Customize your application appearance
              </p>
              <div style={{ 
                background: 'white', 
                borderRadius: 8,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 20 }}>
                  Theme Preferences
                </h2>
                <Story />
              </div>
            </div>
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const CompactView: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <div style={{ 
            maxWidth: 350,
            padding: 16,
            background: 'white',
            borderRadius: 8,
            border: '1px solid #e9ecef'
          }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};