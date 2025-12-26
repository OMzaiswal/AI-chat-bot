import { Request, Response, Router } from "express";
import { chatScehma, sessionIdSchema } from "../validators/chat.schema";
import { handleUserMessage } from "../services/chat.service";
import { fetchHistory } from "../services/history.service";


const router = Router();

router.post('/message', async (req: Request, res: Response) => {
    const parsed = chatScehma.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json(parsed.error.flatten());
        return;
    }
    const { message, sessionId } = parsed.data;

    const result = await handleUserMessage(message, sessionId);
    
    try {
        
    } catch (err: any) {

    }
    res.status(200).json({
        sessionId: result.sessionId,
        reply: result.aiReply
    });
    return;

    
} );


router.post('/history', async (req: Request, res: Response) => {
    const parsed = sessionIdSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json(parsed.error.flatten());
        return;
    }
    const { sessionId, cursor } = parsed.data;
    
    try {
        const history = await fetchHistory(sessionId, 20, cursor as string | undefined);

        res.status(200).json({
            success: true,
            data: history,
            nextCursor: history.length > 0 ? history?.[0].id : null
        });
        return;
    } catch (err) {
        console.log('Error: ', err)
        res.status(500).json({ error: "Failed to fetch history" });
        return;
    }
} )

export default router;