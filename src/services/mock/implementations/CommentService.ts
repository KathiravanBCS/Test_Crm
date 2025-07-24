import { delay } from '../utils';
import { mockComments } from '../data/comments';
import type { UserComment, CreateUserCommentPayload, UpdateUserCommentPayload } from '@/features/comments/types';

export class CommentService {
  private comments: UserComment[] = [...mockComments];
  private nextId = Math.max(...this.comments.map(c => c.id)) + 1;

  async getComments(entityType: string, entityId: number): Promise<UserComment[]> {
    await delay(300);
    
    // Filter comments for the specific entity
    const entityComments = this.comments.filter(
      comment => comment.entityType === entityType && comment.entityId === entityId
    );
    
    // Build comment tree structure
    const commentMap = new Map<number, UserComment>();
    const rootComments: UserComment[] = [];
    
    // First pass: create all comments with empty replies arrays
    entityComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });
    
    // Second pass: build the tree structure
    entityComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });
    
    // Sort root comments by creation date (newest first)
    rootComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Sort replies within each comment (oldest first for better conversation flow)
    const sortReplies = (comment: UserComment) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        comment.replies.forEach(sortReplies);
      }
    };
    
    rootComments.forEach(sortReplies);
    
    return rootComments;
  }

  async createComment(payload: CreateUserCommentPayload): Promise<UserComment> {
    await delay(300);
    
    const newComment: UserComment = {
      id: this.nextId++,
      entityType: payload.entityType,
      entityId: payload.entityId,
      parentCommentId: payload.parentCommentId,
      content: payload.content,
      createdBy: {
        id: 2, // Mock current user
        name: 'Priya Sharma',
        email: 'priya.sharma@vstn.in',
      },
      createdAt: new Date().toISOString(),
      reactions: [],
    };
    
    this.comments.push(newComment);
    return newComment;
  }

  async updateComment(id: number, payload: UpdateUserCommentPayload): Promise<UserComment> {
    await delay(300);
    
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    const updatedComment = {
      ...this.comments[commentIndex],
      content: payload.content,
      updatedAt: new Date().toISOString(),
    };
    
    this.comments[commentIndex] = updatedComment;
    return updatedComment;
  }

  async deleteComment(id: number): Promise<void> {
    await delay(300);
    
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    // Remove the comment and all its replies
    const removeCommentAndReplies = (commentId: number) => {
      // Find all replies to this comment
      const replies = this.comments.filter(c => c.parentCommentId === commentId);
      
      // Recursively remove replies
      replies.forEach(reply => removeCommentAndReplies(reply.id));
      
      // Remove the comment itself
      const index = this.comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        this.comments.splice(index, 1);
      }
    };
    
    removeCommentAndReplies(id);
  }
}