import { OutfitModel } from "../3-models/outfit-model";
import { silhouetteAgent } from "./agents/silhouette-agent";
import { colorAgent } from "./agents/color-agent";
import { occasionAgent } from "./agents/occasion-agent";
import { visionExtractorAgent, ExtractedGarment } from "./agents/vision-extractor-agent";
import { brandDetectorAgent } from "./agents/brand-detector-agent";
import { productCatalogAgent } from "./agents/product-catalog-agent";
import { GarmentModel } from "../3-models/garment-model";
import { garmentService } from "./garment-service";
import { askClaudeJson } from "./agents/claude-client";

export interface StyleFeedback {
    totalScore: number;
    verdict: string;
    detectedOutfit?: {
        top: { type: string; color: string; fit?: string };
        bottom: { type: string; color: string; fit?: string };
        detectedItems: ExtractedGarment[];
    };
    silhouette: { score: number; feedback: string; ruleBreak?: string };
    colorHarmony: { score: number; feedback: string; palette: string };
    occasionMatch: { score: number; feedback: string };
    actionableTips: string[];
}

export interface ImageAnalysisRequest {
    imageBase64: string;
    occasion: string;
    location?: string; 
}

export interface StyleMeRequest {
    occasion: string;
    location?: string;
}

export interface StyleMeResponse {
    selectedOutfit: {
        top: GarmentModel;
        bottom: GarmentModel;
    };
    stylingRationale: string;
    feedback: StyleFeedback;
}

class Service {

    public async analyzeOutfitFromImage(request: ImageAnalysisRequest): Promise<StyleFeedback> {
        if (!request.imageBase64) {
            throw new Error("Image is required for visual analysis");
        }

        const visionData = await visionExtractorAgent.extractOutfit(request.imageBase64);

        this.identifyAndSaveGarmentsToWardrobe(request.imageBase64, visionData.detectedItems);

        const fullOccasionContext = request.location 
            ? `${request.occasion} in ${request.location}`
            : request.occasion;

        const outfit = new OutfitModel({
            top: { type: visionData.top.type, color: visionData.top.color },
            bottom: { type: visionData.bottom.type, color: visionData.bottom.color },
            occasion: fullOccasionContext || "casual street"
        } as OutfitModel);

        const results = await Promise.allSettled([
            silhouetteAgent.analyze(outfit),
            colorAgent.analyze(outfit),
            occasionAgent.analyze(outfit)
        ]);

        const silhouette = results[0].status === "fulfilled" 
            ? results[0].value 
            : { score: 70, feedback: "Silhouette agent temporarily unavailable" };

        const color = results[1].status === "fulfilled" 
            ? results[1].value 
            : { score: 70, feedback: "Color harmony agent temporarily unavailable", palette: "Unknown" };

        const occasion = results[2].status === "fulfilled" 
            ? results[2].value 
            : { score: 70, feedback: "Occasion agent temporarily unavailable" };

        const totalScore = Math.round((silhouette.score + color.score + occasion.score) / 3);

        const actionableTips: string[] = [];
        if (silhouette.ruleBreak) actionableTips.push(silhouette.ruleBreak);
        if (totalScore >= 90) {
            actionableTips.push("Exceptional execution! Consider finishing with a minimal accent accessory.");
        } else {
            actionableTips.push("Consider adjusting the drape or tucking the top to optimize the upper-to-lower body ratio.");
        }

        return {
            totalScore,
            verdict: totalScore >= 90 ? "Exceptional style cohesion across all parameters." : "Solid base with specific refinement opportunities.",
            detectedOutfit: {
                top: visionData.top,
                bottom: visionData.bottom,
                detectedItems: visionData.detectedItems
            },
            silhouette,
            colorHarmony: color,
            occasionMatch: occasion,
            actionableTips
        };
    }

    private async identifyAndSaveGarmentsToWardrobe(base64Image: string, basicItems: ExtractedGarment[]): Promise<void> {
        try {
            console.log("[Pipeline] Brand Agent scanning for logos, collabs & emblems...");
            const brandClues = await brandDetectorAgent.detectBrandsAndClues(base64Image);

            for (const item of basicItems) {
                const matchingClue = brandClues.find(c => c.category === item.category);

                let finalOfficialName = item.name;

                if (matchingClue) {
                    const catalogResult = await productCatalogAgent.identifyOfficialProduct(matchingClue);
                    finalOfficialName = catalogResult.officialName;
                }

                const newGarment = new GarmentModel({
                    category: item.category,
                    name: finalOfficialName,
                    color: item.color,
                    fit: item.fit || "regular"
                } as any);

                await garmentService.addGarment(newGarment);
                console.log(`[Wardrobe DB] Registered Official Item: "${finalOfficialName}" (${item.color})`);
            }
        } catch (err: any) {
            console.error("[Wardrobe DB] Pipeline error:", err?.message || err);
        }
    }

    public async analyzeOutfit(outfit: OutfitModel): Promise<StyleFeedback> {
        outfit.validate();
        const results = await Promise.allSettled([
            silhouetteAgent.analyze(outfit),
            colorAgent.analyze(outfit),
            occasionAgent.analyze(outfit)
        ]);
        const silhouette = results[0].status === "fulfilled" ? results[0].value : { score: 70, feedback: "Silhouette unavailable" };
        const color = results[1].status === "fulfilled" ? results[1].value : { score: 70, feedback: "Color unavailable", palette: "Unknown" };
        const occasion = results[2].status === "fulfilled" ? results[2].value : { score: 70, feedback: "Occasion unavailable" };
        const totalScore = Math.round((silhouette.score + color.score + occasion.score) / 3);
        return {
            totalScore,
            verdict: totalScore >= 90 ? "Exceptional style cohesion." : "Solid base with refinement opportunities.",
            silhouette,
            colorHarmony: color,
            occasionMatch: occasion,
            actionableTips: []
        };
    }

    public async generateOutfitFromWardrobe(request: StyleMeRequest): Promise<StyleMeResponse> {
        const garments = await garmentService.getAllGarments();
        const tops = garments.filter(g => g.category === "top");
        const bottoms = garments.filter(g => g.category === "bottom");

        if (tops.length === 0 || bottoms.length === 0) {
            throw new Error("You need at least one top and one bottom in your wardrobe for Style Me to work.");
        }

        const prompt = `
You are the MASTER PERSONAL STYLIST.
A client needs the best possible outfit from their wardrobe for this event:
Event & Vibe: ${request.occasion}
Location/City: ${request.location || "Tel Aviv"}

Available Tops in Wardrobe:
${JSON.stringify(tops.map(t => ({ id: t.id, name: t.name, color: t.color, fit: t.fit })))}

Available Bottoms in Wardrobe:
${JSON.stringify(bottoms.map(b => ({ id: b.id, name: b.name, color: b.color, fit: b.fit })))}

Task:
1. Select the SINGLE BEST top (by id) and SINGLE BEST bottom (by id) that create the highest cohesion.
2. Provide a 2-sentence styling rationale explaining why this combo works best.

Respond ONLY with raw JSON (no markdown):
{
  "selectedTopId": number,
  "selectedBottomId": number,
  "stylingRationale": "2 concise sentences explaining the pairing decision"
}
`;
        const decision = await askClaudeJson("style-me-director", prompt);

        const chosenTop = tops.find(t => t.id === decision.selectedTopId) || tops[0];
        const chosenBottom = bottoms.find(b => b.id === decision.selectedBottomId) || bottoms[0];

        const outfit = new OutfitModel({
            top: { type: chosenTop.name, color: chosenTop.color },
            bottom: { type: chosenBottom.name, color: chosenBottom.color },
            occasion: request.location ? `${request.occasion} in ${request.location}` : request.occasion
        } as OutfitModel);

        const feedback = await this.analyzeOutfit(outfit);

        return {
            selectedOutfit: {
                top: chosenTop,
                bottom: chosenBottom
            },
            stylingRationale: decision.stylingRationale || "Curated for balanced silhouette and tonal harmony.",
            feedback
        };
    }
}

export const service = new Service();