import { askClaudeVisionJson } from "./claude-client";

export interface BrandClues {
    category: "top" | "bottom" | "shoes";
    detectedBrand: string | null;     // e.g. "Adidas Originals", "Nike Jordan", "Unbranded"
    collaborationOrTheme: string | null; // e.g. "SpongeBob / Patrick Star", "Boston Celtics NBA"
    distinctiveFeatures: string;      // e.g. "Striped Linen Shorts", "Graphic Crewneck Tee"
    recommendedSearchQuery: string;  // e.g. "Adidas Superstar Patrick Star pink sneakers"
}

class BrandDetectorAgent {

    public async detectBrandsAndClues(base64Image: string): Promise<BrandClues[]> {
        const prompt = `
You are the ELITE SNEAKER & STREETWEAR BRAND DETECTOR.
Your mission is to inspect this image for logos, brand emblems, team graphics, characters, and iconic model silhouettes.

For each distinct garment/footwear item visible in the image:
1. Identify the Brand (e.g. Nike, Jordan, Adidas, Zara, or Unbranded).
2. Identify any Collaboration, Team, or Pop Culture Theme (or null).
3. distinctiveFeatures: A SHORT, CLEAN product title (3 to 6 words ONLY). Example: "Striped Casual Shorts", "Boxy White Crewneck", "Baggy Blue Denim". NEVER write explanations, long sentences, or speculate about brands here!
4. recommendedSearchQuery: The best 3-6 word Google search query to find the exact model.

Respond ONLY with raw JSON (no markdown):
{
  "items": [
    {
      "category": "top" | "bottom" | "shoes",
      "detectedBrand": "Brand Name or null",
      "collaborationOrTheme": "Collaboration/Team or null",
      "distinctiveFeatures": "3-6 words clean title (e.g. Striped Casual Shorts)",
      "recommendedSearchQuery": "Best query to find exact item name on Google"
    }
  ]
}
`;

        const parsed = await askClaudeVisionJson("brand-detector-agent", base64Image, prompt);
        return parsed.items || [];
    }
}

export const brandDetectorAgent = new BrandDetectorAgent();