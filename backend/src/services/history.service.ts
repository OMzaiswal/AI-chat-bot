import { prisma } from "../lib/prisma"

export const fetchHistory = async (sessionId: string, limit: number = 20, cursor?: string) => {

    try {
        const conversation = await prisma.conversation.findUnique({
            where: {
                sessionId
            }
        })

        if(!conversation) {
            const error = new Error("Invalid or wrong sessionId");
            (error as any).statusCode = 404; 
            throw error;
        }

        const histry = await prisma.message.findMany({
            where: {
                conversationId: conversation.id
            },
            select: {
                id: true,
                text: true,
                sender: true,
                createdAt: true
            },
            take: limit,
            ...(cursor && { skip: 1, cursor: { id: cursor }}),
            orderBy: { createdAt: 'desc' }
        });
        return histry.reverse();

    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
}