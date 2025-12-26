import { Sender } from "../generated/prisma/enums";
import { STORE_FAQS } from "../constants/faqs";
import { Prompts } from "../constants/prompts";
import OpenAI from "openai";

export const GenerateLLMReply = async (history: {text: string, sender: Sender}[], userMessage: string) => {

    const formattedHistory = history.reverse().map(m => {
        if (m.sender === Sender.User) {
            return {
                role: 'user',
                content: [{ type: 'input_text', text: m.text }]
            }
        } 
        return {
            role: 'assistant',
                content: [{ type: 'output_text', text: m.text }]
        }
    }
)
    const llmInput = [
        { role: 'system', content: [{ type: 'input_text', text: Prompts }]},
        { role: 'system', content: [{ type: 'input_text', text: STORE_FAQS }]},
        ...formattedHistory,
        { role: 'user', content: [{ type: 'input_text', text: userMessage }] }
    ]
    console.log(llmInput);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
        model: 'gpt-5-nano',
        input: llmInput as any
    })
    // console.log(response.output_text);
    return response.output_text;
}