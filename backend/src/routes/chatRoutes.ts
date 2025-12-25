import { Request, Response, Router } from "express";
import { chatScehma, sessionIdSchema } from "../validators/chat.schema";
import { handleUserMessage } from "../services/chat.service";


const router = Router();

router.post('/message', (req: Request, res: Response) => {
    const parsed = chatScehma.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json(parsed.error.flatten());
        return;
    }
    const { message, sessionId } = parsed.data;

    const history = handleUserMessage(message, sessionId);
    

    res.status(200).json({message: `Received your message - ${message}`})
} );


router.post('/history', (req: Request, res: Response) => {
    const parsed = sessionIdSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json(parsed.error.flatten());
        return;
    }
    const { sessionId } = parsed.data;
    res.json(`This is parsed data ${sessionId}`)
} )

export default router;