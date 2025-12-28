import { Request, Response, Router } from "express";
import { chatScehma, sessionIdSchema } from "../validators/chat.schema";
import { handleUserMessage } from "../services/chat.service";
import { fetchHistory } from "../services/history.service";


const router = Router();

router.post('/message', async (req: Request, res: Response) => {
    
    
    try {
        const parsed = chatScehma.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json(parsed.error.flatten());
            return;
        }
        const { message, sessionId } = parsed.data;

        const result = await handleUserMessage(message, sessionId);

        res.status(200).json({
            sessionId: result.sessionId,
            reply: result.message
        });
        return;
    } catch (err: any) {
        if (err.message === "Invalid or wrong sessionId") {
            res.status(404).json({ 
                success: false, 
                error: "Wrong or invalid sessionId" 
            });
            return;
        };
        if (err.message.includes("LLM")) {
            res.status(503).json({ error: "The AI is currently overloaded. Please try again." });
            return;
        };
        res.status(500).json({ error: "Something went wrong on our end." });
        return;
    }
    

    
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
            nextCursor: history.length === 20 ? history[0].id : null
        });
        return;
    } catch (err: any) {
        if (err.message === "Invalid or wrong sessionId") {
            res.status(404).json({ 
                success: false, 
                message: "Wrong or invalid sessionId" 
            });
            return;
        }
        
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
} )

export default router;