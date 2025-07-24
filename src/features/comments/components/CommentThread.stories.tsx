import type { Meta, StoryObj } from '@storybook/react';
import { CommentThread } from './CommentThread';
import { fn } from '@storybook/test';
import type { UserComment } from '../types';

const meta: Meta<typeof CommentThread> = {
  title: 'Features/Comments/CommentThread',
  component: CommentThread,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Nesting level for replies',
    },
    currentUserId: {
      control: 'number',
      description: 'ID of the current user',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseComment: UserComment = {
  id: 1,
  entityType: 'customer',
  entityId: 1,
  content: '<p>This is a sample comment with <strong>rich text</strong> formatting.</p>',
  createdBy: {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@vstn.in',
  },
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  reactions: [
    {
      id: 1,
      commentId: 1,
      userId: 2,
      emoji: '👍',
      createdAt: new Date().toISOString(),
    },
  ],
};

export const Default: Story = {
  args: {
    comment: baseComment,
    onReply: fn(),
    currentUserId: 2,
  },
};

export const OwnComment: Story = {
  args: {
    comment: baseComment,
    onReply: fn(),
    currentUserId: 1, // Same as comment author
  },
};

export const WithReplies: Story = {
  args: {
    comment: {
      ...baseComment,
      replies: [
        {
          id: 2,
          entityType: 'customer',
          entityId: 1,
          parentCommentId: 1,
          content: '<p>Great point! I completely agree with your assessment.</p>',
          createdBy: {
            id: 2,
            name: 'Rahul Kumar',
            email: 'rahul.kumar@vstn.in',
          },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          reactions: [],
        },
        {
          id: 3,
          entityType: 'customer',
          entityId: 1,
          parentCommentId: 1,
          content: '<p>I have a different perspective on this. Let me explain...</p>',
          createdBy: {
            id: 3,
            name: 'Anita Desai',
            email: 'anita.desai@vstn.in',
          },
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          reactions: [
            {
              id: 2,
              commentId: 3,
              userId: 1,
              emoji: '👍',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
    onReply: fn(),
    currentUserId: 2,
  },
};

export const NestedReplies: Story = {
  args: {
    comment: {
      ...baseComment,
      replies: [
        {
          id: 2,
          entityType: 'customer',
          entityId: 1,
          parentCommentId: 1,
          content: '<p>This is a reply to the main comment.</p>',
          createdBy: {
            id: 2,
            name: 'Rahul Kumar',
            email: 'rahul.kumar@vstn.in',
          },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          reactions: [],
          replies: [
            {
              id: 4,
              entityType: 'customer',
              entityId: 1,
              parentCommentId: 2,
              content: '<p>This is a nested reply!</p>',
              createdBy: {
                id: 3,
                name: 'Anita Desai',
                email: 'anita.desai@vstn.in',
              },
              createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              reactions: [],
            },
          ],
        },
      ],
    },
    onReply: fn(),
    currentUserId: 2,
  },
};

export const EditedComment: Story = {
  args: {
    comment: {
      ...baseComment,
      updatedAt: new Date().toISOString(),
    },
    onReply: fn(),
    currentUserId: 2,
  },
};

export const WithMultipleReactions: Story = {
  args: {
    comment: {
      ...baseComment,
      reactions: [
        {
          id: 1,
          commentId: 1,
          userId: 2,
          emoji: '👍',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          commentId: 1,
          userId: 3,
          emoji: '👍',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          commentId: 1,
          userId: 4,
          emoji: '👎',
          createdAt: new Date().toISOString(),
        },
      ],
    },
    onReply: fn(),
    currentUserId: 5,
  },
};