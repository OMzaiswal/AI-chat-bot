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




export default router;