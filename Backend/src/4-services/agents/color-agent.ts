import { askClaudeJson } from "./claude-client";
import { OutfitModel } from "../../3-models/outfit-model";

export interface ColorResult {
    score: number;
    feedback: string;
    palette: string;
}

class ColorAgent {
    public async analyze(outfit: OutfitModel): Promise<ColorResult> {
        const prompt = `
You are the COLOR HARMONY AGENT in an elite fashion system.
Analyze ONLY the color relationship and palette harmony between:
Top Color: ${outfit.top.color}
Bottom Color: ${outfit.bottom.color}

Fashion Color Rules:
- Monochromatic or tonal shades (e.g. black on black, beige on brown) = minimalist elegance.
- High contrast classics (black & white, navy & white) = timeless sharpness.
- Clashing uncomplimentary tones without an anchor = visual discord (penalize score).

Respond ONLY with raw JSON (no markdown):
{
  "score": number (0-100),
  "feedback": "1-2 sentences strictly on color tones, contrast, and visual harmony",
  "palette": "Palette name (e.g., Monochromatic, Earth Tones, High Contrast, Muted Neutral)"
}
`;
        const parsed = await askClaudeJson("color-agent", prompt);
        return { score: parsed.score ?? 80, feedback: parsed.feedback, palette: parsed.palette || "Custom Mix" };
    }
}

export const colorAgent = new ColorAgent();