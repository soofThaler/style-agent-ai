export interface ClothingItem {
    type: string;
    color: string;
}

export interface OutfitModel {
    top: ClothingItem;
    bottom: ClothingItem;
    occasion: string;
}

export interface StyleFeedback {
    totalScore: number;
    verdict: string;
    detectedOutfit?: {
        top: { type: string; color: string; fit?: string };
        bottom: { type: string; color: string; fit?: string };
    };
    silhouette: { score: number; feedback: string; ruleBreak?: string };
    colorHarmony: { score: number; feedback: string; palette: string };
    occasionMatch: { score: number; feedback: string };
    actionableTips: string[];
}