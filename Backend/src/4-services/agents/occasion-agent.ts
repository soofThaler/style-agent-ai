import { askClaudeJson } from "./claude-client";
import { OutfitModel } from "../../3-models/outfit-model";
import { fetchLiveWeather } from "../../4-services/weather-service";

export interface OccasionResult {
    score: number;
    feedback: string;
}

class OccasionAgent {
    public async analyze(outfit: OutfitModel): Promise<OccasionResult> {

        const weather = await fetchLiveWeather(outfit.city);
        const weatherContext = weather 
            ? `Current Weather in ${weather.city}: ${weather.temperatureC}°C, ${weather.description}`
            : "Weather: Mild / Standard indoor climate";
            
        const prompt = `
You are the DRESS CODE & OCCASION AGENT in an elite fashion system.
Analyze whether this outfit fits the specific setting AND the live weather:
Outfit: ${outfit.top.color} ${outfit.top.type} with ${outfit.bottom.color} ${outfit.bottom.type}
Setting / Occasion: ${outfit.occasion}
${weatherContext}

Evaluate appropriateness, formality calibration, thermal comfort for the weather, and vibe matching.

Respond ONLY with raw JSON (no markdown):
{
  "score": number (0-100),
  "feedback": "1-2 sentences on how well the outfit fits the occasion and the current weather"
}
`;
        const parsed = await askClaudeJson("occasion-agent", prompt);
        return { score: parsed.score ?? 85, feedback: parsed.feedback };
    }
}

export const occasionAgent = new OccasionAgent();