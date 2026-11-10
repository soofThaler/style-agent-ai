import Anthropic from "@anthropic-ai/sdk";
import { appConfig } from "../../2-utils/app-config";

const anthropic = new Anthropic({ apiKey: appConfig.anthropicApiKey });


const TEXT_MODEL = "claude-haiku-5-5";
const VISION_MODEL = "claude-sonnet-5-5";


export async function askClaudeJson(agentName: string, prompt: string): Promise<any> {
    try {
        const message = await anthropic.messages.create({
            model: TEXT_MODEL,
            max_tokens: 400,
            messages: [{ role: "user", content: prompt }]
        });
        const block = message.content.find(b => b.type === "text");
        if (!block || block.type !== "text") throw new Error("Claude response contained no text block");
        const match = block.text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("No JSON object in Claude response: " + block.text);
        return JSON.parse(match[0]);
    }
    catch (err: any) {
        console.error(`[${agentName}] Claude call failed:`, err?.status ?? "", err?.message ?? err);
        throw err;
    }
}


export async function askClaudeVisionJson(agentName: string, base64Image: string, prompt: string): Promise<any> {
    try {

        let cleanBase64 = base64Image;
        let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg";

        if (base64Image.includes(";base64,")) {
            const parts = base64Image.split(";base64,");
            const mimeMatch = parts[0].match(/data:(image\/[a-zA-Z]+)/);
            if (mimeMatch) {
                mediaType = mimeMatch[1] as any;
            }
            cleanBase64 = parts[1];
        }

        const message = await anthropic.messages.create({
            model: VISION_MODEL,
            max_tokens: 1200,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mediaType,
                            data: cleanBase64
                        }
                    },
                    {
                        type: "text",
                        text: prompt
                    }
                ]
            }]
        });

        const block = message.content.find(b => b.type === "text");
        if (!block || block.type !== "text") throw new Error("Claude vision response contained no text block");
        const match = block.text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("No JSON object in Claude response: " + block.text);
        return JSON.parse(match[0]);
    }
    catch (err: any) {
        console.error(`[${agentName}] Claude Vision call failed:`, err?.status ?? "", err?.message ?? err);
        throw err;
    }
}