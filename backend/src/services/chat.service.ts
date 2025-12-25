import { prisma } from "../lib/prisma"

export const handleUserMessage = async (message: string, sessionId?: string ) => {
    if (sessionId) {
        const conversation = await prisma.conversation.findUnique({
            select: { 
                id: true
            },
            where: { sessionId }
        });
        if (conversation) {
            const history = await prisma.message.findMany({
                select: {
                    text: true,
                    sender: true
                },
                where: { conversationId: conversation.id },
                orderBy: { createdAt: 'desc'},
                take: 10
            })

            await prisma.message.create({
                data: {
                    text: message,
                    sender: 'User',
                    conversationId: conversation.id
                }
            })
            return history;
        }
    }
}