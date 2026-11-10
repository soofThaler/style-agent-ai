import axios from "axios";
import { OutfitModel, StyleFeedback } from "../Models/OutfitModel";
import { appConfig } from "../Utils/AppConfig";

export interface ImageAnalysisPayload {
    imageBase64: string;
    occasion: string;
    location?: string;
}

import { GarmentModel } from "../Models/GarmentModel";

export interface StyleMePayload {
    occasion: string;
    location?: string;
}

export interface StyleMeResult {
    selectedOutfit: {
        top: GarmentModel;
        bottom: GarmentModel;
    };
    stylingRationale: string;
    feedback: StyleFeedback;
}

class StylistService {


    public async analyzeOutfit(outfit: OutfitModel): Promise<StyleFeedback> {
        const response = await axios.post<StyleFeedback>(`${appConfig.stylistUrl}/analyze`, outfit);
        return response.data;
    }


    public async analyzeOutfitImage(payload: ImageAnalysisPayload): Promise<StyleFeedback> {
        const response = await axios.post<StyleFeedback>(`${appConfig.stylistUrl}/analyze-image`, payload);
        return response.data;
    }

    public async styleMeFromWardrobe(payload: StyleMePayload): Promise<StyleMeResult> {
        const response = await axios.post<StyleMeResult>(`${appConfig.stylistUrl}/style-me`, payload);
        return response.data;
    }

}

export const stylistService = new StylistService();
