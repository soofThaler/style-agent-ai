import { askClaudeJson } from "./claude-client";
import { searchFashionWeb } from "../../2-utils/web-search";
import { BrandClues } from "./brand-detector-agent";

export interface CatalogedProduct {
    category: "top" | "bottom" | "shoes";
    officialName: string;    // e.g. "Jordan Air Jordan 1 Graphic Tee"
    brand: string | null;     // e.g. "Jordan"
    verifiedFromWeb: boolean;
}

class ProductCatalogAgent {

    public async identifyOfficialProduct(clue: BrandClues): Promise<CatalogedProduct> {
        const brand = clue.detectedBrand && clue.detectedBrand.toLowerCase() !== "unbranded"
            ? clue.detectedBrand
            : null;

        if (!brand) {
            const cleanShortName = clue.distinctiveFeatures.split(".")[0].slice(0, 45).trim();
            return {
                category: clue.category,
                officialName: cleanShortName || "Casual Wardrobe Piece",
                brand: null,
                verifiedFromWeb: false
            };
        }

        console.log(`[Catalog Agent] Searching web for: "${clue.recommendedSearchQuery}"...`);
        const searchResults = await searchFashionWeb(clue.recommendedSearchQuery);

        const prompt = `
You are the OFFICIAL FASHION CATALOGING AGENT.
Item Brand: ${brand}
Collaboration/Theme: ${clue.collaborationOrTheme || "None"}
Visual cues: ${clue.distinctiveFeatures}

Web Search Results:
${JSON.stringify(searchResults, null, 2)}

Instructions:
- The product title MUST START with the Brand name "${brand}".
- Followed by the model/graphic name (e.g. "${brand} Air Jordan 1 Graphic Tee", "${brand} Superstar Patrick Star").
- Keep it 3 to 6 words maximum, punchy and commercial.

Respond ONLY with raw JSON (no markdown):
{
  "officialName": "${brand} [Model Name]",
  "brand": "${brand}",
  "verifiedFromWeb": true or false
}
`;

        try {
            const parsed = await askClaudeJson("product-catalog-agent", prompt);
            let name = (parsed.officialName || `${brand} ${clue.distinctiveFeatures}`).trim();
            
            if (!name.toLowerCase().startsWith(brand.toLowerCase())) {
                name = `${brand} ${name}`;
            }

            return {
                category: clue.category,
                officialName: name.slice(0, 60),
                brand: brand,
                verifiedFromWeb: parsed.verifiedFromWeb ?? false
            };
        } catch {
            return {
                category: clue.category,
                officialName: `${brand} ${clue.distinctiveFeatures}`.slice(0, 60),
                brand: brand,
                verifiedFromWeb: false
            };
        }
    }
}

export const productCatalogAgent = new ProductCatalogAgent();