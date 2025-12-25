import { Sender } from "../generated/prisma/enums";
import { STORE_FAQS } from "../constants/faqs";
import { Prompts } from "../constants/prompts";

export const GenerateLLMReply = async (history: {text: string, sender: Sender}[], userMessage: string) => {
    const input = [
        { role: 'system', content: Prompts },
        { role: 'system', content: STORE_FAQS },
        ...history.reverse(),
        { role: 'User', content: userMessage }
    ]
    console.log(input);
    
}