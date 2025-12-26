import { z } from 'zod';

export const chatScehma = z.object({
    message: z.string().min(1, 'Cannot send empty message').max(200, 'Message can not exceed 200 characters').trim(),
    sessionId: z.string().min(1, 'Invalid session id').max(30, 'Invalid Session Id').optional()
})

export const sessionIdSchema = z.object({
    sessionId: z.string().min(1, 'Invalid sessionId').max(30, 'Invalid sessonId'),
    cursor: z.string().optional
})