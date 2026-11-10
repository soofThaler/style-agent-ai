import { askClaudeJson } from "./claude-client";
import { OutfitModel } from "../../3-models/outfit-model";

export interface SilhouetteResult {
    score: number;
    feedback: string;
    ruleBreak?: string;
}

class SilhouetteAgent {
    public async analyze(outfit: OutfitModel): Promise<SilhouetteResult> {
        const prompt = `
You are the SILHOUETTE & PROPORTION AGENT in an elite fashion system.
Analyze ONLY the volume, drape, and proportions between:
Top: ${outfit.top.color} ${outfit.top.type}
Bottom: ${outfit.bottom.color} ${outfit.bottom.type}

Fashion Rules to apply:
- Oversized top + skinny bottom = top-heavy imbalance (penalize score).
- Oversized top + wide/baggy/relaxed bottom = modern balanced streetwear (high score).
- Fitted top + wide-leg bottom = flattering classic contrast (high score).

Respond ONLY with raw JSON (no markdown):
{
  "score": number (0-100),
  "feedback": "1-2 sharp sentences on volume and silhouette balance",
  "ruleBreak": "rule violated if any, else null"
}
`;
        const parsed = await askClaudeJson("silhouette-agent", prompt);
        return { score: parsed.score ?? 75, feedback: parsed.feedback, ruleBreak: parsed.ruleBreak || undefined };
    }
}

export const silhouetteAgent = new SilhouetteAgent();