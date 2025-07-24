import type { Meta, StoryObj } from '@storybook/react';

/**
 * Creates a standardized Storybook meta configuration with minimal boilerplate
 * @param component The component to create stories for
 * @param title Optional custom title (defaults to component path)
 */
export function createMeta<T extends React.ComponentType<any>>(
  component: T,
  title?: string
): Meta<T> {
  return {
    title: title || `UI/${component.displayName || component.name}`,
    component,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      // Common argTypes that apply to most components
      className: { control: false },
      style: { control: false },
      ref: { control: false },
    },
  } as Meta<T>;
}

/**
 * Type helper for creating stories with proper typing
 */
export type Story<T extends React.ComponentType<any>> = StoryObj<Meta<T>>;