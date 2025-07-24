import { faker } from '@faker-js/faker';
import type { UserComment } from '@/features/comments/types';
import { mockEmployees } from './employees';

// Convert employees to comment users
const users = mockEmployees.slice(0, 6).map(emp => ({
  id: emp.id,
  name: emp.name,
  email: emp.email,
  avatar: undefined
}));

function generateComment(
  id: number,
  entityType: string,
  entityId: number,
  parentCommentId?: number
): UserComment {
  const user = faker.helpers.arrayElement(users);
  const createdAt = faker.date.recent({ days: 30 });
  
  return {
    id,
    entityType,
    entityId,
    parentCommentId,
    content: faker.helpers.arrayElement([
      '<p>Great progress on this! I think we should also consider the impact on our timeline.</p>',
      '<p>I agree with the approach. Let me know if you need any help with the implementation.</p>',
      '<p>Can we schedule a quick call to discuss this further? I have some concerns about the budget allocation.</p>',
      '<p>Thanks for the update. I\'ve reviewed the documents and everything looks good to go.</p>',
      '<p>Just a quick note - we need to ensure compliance with the new regulations before proceeding.</p>',
      '<p>Excellent work! The client will be pleased with this proposal.</p>',
      '<p>I\'ve made some minor adjustments to the scope. Please review and let me know your thoughts.</p>',
      '<p>Following up on our earlier discussion - have we received the signed documents yet?</p>',
    ]),
    createdBy: user,
    createdAt: createdAt.toISOString(),
    updatedAt: faker.datatype.boolean() ? faker.date.between({ from: createdAt, to: new Date() }).toISOString() : undefined,
    reactions: faker.datatype.boolean() ? [
      {
        id: faker.number.int({ min: 1, max: 100 }),
        commentId: id,
        userId: faker.helpers.arrayElement(users.filter(u => u.id !== user.id)).id,
        emoji: faker.helpers.arrayElement(['👍', '👎']),
        createdAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
      }
    ] : [],
  };
}

// Generate comments for different entities
export const mockComments: UserComment[] = [];
let commentId = 1;

// Customer comments
[1, 2, 3].forEach(customerId => {
  // Root comments
  const rootCount = faker.number.int({ min: 2, max: 5 });
  for (let i = 0; i < rootCount; i++) {
    const rootComment = generateComment(commentId++, 'customer', customerId);
    mockComments.push(rootComment);
    
    // Add replies
    const replyCount = faker.number.int({ min: 0, max: 3 });
    for (let j = 0; j < replyCount; j++) {
      const reply = generateComment(commentId++, 'customer', customerId, rootComment.id);
      mockComments.push(reply);
    }
  }
});

// Partner comments
[1, 2].forEach(partnerId => {
  const rootCount = faker.number.int({ min: 1, max: 3 });
  for (let i = 0; i < rootCount; i++) {
    const rootComment = generateComment(commentId++, 'partner', partnerId);
    mockComments.push(rootComment);
    
    const replyCount = faker.number.int({ min: 0, max: 2 });
    for (let j = 0; j < replyCount; j++) {
      const reply = generateComment(commentId++, 'partner', partnerId, rootComment.id);
      mockComments.push(reply);
    }
  }
});

// Proposal comments
[1, 2, 3, 4].forEach(proposalId => {
  const rootCount = faker.number.int({ min: 3, max: 6 });
  for (let i = 0; i < rootCount; i++) {
    const rootComment = generateComment(commentId++, 'proposal', proposalId);
    mockComments.push(rootComment);
    
    const replyCount = faker.number.int({ min: 0, max: 4 });
    for (let j = 0; j < replyCount; j++) {
      const reply = generateComment(commentId++, 'proposal', proposalId, rootComment.id);
      mockComments.push(reply);
    }
  }
});

// Sort comments by creation date (newest first)
mockComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());