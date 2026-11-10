import { askClaudeVisionJson } from "./claude-client";

export interface ExtractedGarment {
    category: "top" | "bottom" | "shoes";
    name: string;        // e.g. "Boston Celtics graphic tee" or "blue denim jacket"
    color: string;       // e.g. "white with green accents" or "faded blue"
    fit: string;         // e.g. "boxy", "oversized", "wide-leg", "slim"
}

export interface VisionExtractionResult {
    top: { type: string; color: string; fit?: string };
    bottom: { type: string; color: string; fit?: string };
    shoes?: { type: string; color: string };
    detectedItems: ExtractedGarment[]; 
}

class VisionExtractorAgent {
    public async extractOutfit(base64Image: string): Promise<VisionExtractionResult> {
        const prompt = `
You are the COMPUTER VISION GARMENT DETECTOR in an elite fashion platform.
Analyze this image (which could be a mirror selfie, person wearing an outfit, or clothing laid out on a bed/floor/flat lay).

Detect all visible clothing garments:
1. Upper garment (top: shirt, hoodie, tee, jacket, sweater)
2. Lower garment (bottom: jeans, pants, cargo, shorts, skirt)
3. Footwear if visible (shoes/sneakers/boots)

Rules for naming:
- If you recognize a clear brand, team, or logo (e.g., Boston Celtics, Nike, Adidas, Carhartt), include it in the name.
- If not recognizable, use an accurate descriptive name (e.g., "vintage wash wide-leg denim", "oversized grey crewneck").
- Accurately determine the dominant color and the fit/silhouette (oversized, boxy, wide-leg, relaxed, skinny, tailored).

Respond ONLY with raw JSON (no markdown):
{
  "top": {
    "type": "garment type and style (e.g. oversize Boston Celtics tee)",
    "color": "color (e.g. white with green print)",
    "fit": "fit description (e.g. boxy relaxed)"
  },
  "bottom": {
    "type": "garment type and style (e.g. wide-leg cargo pants)",
    "color": "color (e.g. olive green)",
    "fit": "fit description (e.g. wide-leg)"
  },
  "shoes": {
    "type": "shoe type if visible or null",
    "color": "shoe color or null"
  },
  "detectedItems": [
    {
      "category": "top",
      "name": "full recognizable or descriptive name",
      "color": "color",
      "fit": "fit"
    },
    {
      "category": "bottom",
      "name": "full recognizable or descriptive name",
      "color": "color",
      "fit": "fit"
    }
  ]
}
`;
        const parsed = await askClaudeVisionJson("vision-extractor-agent", base64Image, prompt);

        return {
            top: parsed.top || { type: "unspecified top", color: "neutral", fit: "regular" },
            bottom: parsed.bottom || { type: "unspecified bottom", color: "neutral", fit: "regular" },
            shoes: parsed.shoes || undefined,
            detectedItems: parsed.detectedItems || []
        };
    }
}

export const visionExtractorAgent = new VisionExtractorAgent();