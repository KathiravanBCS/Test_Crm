export interface UserComment {
  id: number;
  entityType: string;
  entityId: number;
  parentCommentId?: number;
  content: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  replies?: UserComment[];
  reactions?: UserCommentReaction[];
}

export interface UserCommentReaction {
  id: number;
  commentId: number;
  userId: number;
  emoji: string;
  createdAt: string;
}

export interface CreateUserCommentPayload {
  entityType: string;
  entityId: number;
  parentCommentId?: number;
  content: string;
}

export interface UpdateUserCommentPayload {
  content: string;
}

export type EntityType = 'customer' | 'partner' | 'proposal' | 'engagement' | 'engagement_letter' | 'invoice' | 'task';