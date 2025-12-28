import { Sender } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma"
import { GenerateLLMReply } from "./llm.service";

type HistoryItem = {
    text: string;
    sender: Sender;
  };

type HandleUserMessageResult = {
    sessionId: string;
    message: {}
}

export const handleUserMessage = async (message: string, sessionId?: string ): Promise<HandleUserMessageResult> => {
    try {
        let conversationId: string;
        let finalSessionId: string;
        let history: HistoryItem[] = [];
        if (sessionId) {
            const conversation = await prisma.conversation.findUnique({
                where: { sessionId }
            });
            if (!conversation) {
                throw new Error("Invalid or wrong sessionId");
            }
            conversationId = conversation.id;
            finalSessionId = conversation.sessionId
            history = await prisma.message.findMany({
                select: {
                    text: true,
                    sender: true
                },
                where: { conversationId },
                orderBy: { createdAt: 'desc'},
                take: 10
            })
            console.log(`history under --- ${history}`);
            
        } else {
            const newConverstaion = await prisma.conversation.create({});
            conversationId = newConverstaion.id;
            finalSessionId = newConverstaion.sessionId;
        }
        const newMeg = await prisma.message.create({
            data: {
                text: message,
                sender: 'User',
                conversationId
            }
        })

        if (newMeg) {
            console.log('New Message added successfully in the DB');
        }



        // Calling LLMService here
        const aiReply = await GenerateLLMReply(history, message);

        const addNewReply = await prisma.message.create({
            data: {
                text: aiReply,
                sender: 'AI',
                conversationId
            },
            select: {
                id: true,
                text: true,
                sender: true,
                createdAt: true
            }
        })

        if (addNewReply) {
            console.log('New AI reply added to DB');
        }


        return {
            sessionId: finalSessionId,
            message: addNewReply
        }
    } catch (err: any) {
        console.log('This is the catch error', err);
        throw err;

    }
}