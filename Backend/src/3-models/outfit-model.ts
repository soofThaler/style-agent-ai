import Joi from "joi";
import { ValidationError } from "./client-errors";

export interface ClothingItem {
    type: string;  
    color: string; 
}

export class OutfitModel {
    public top: ClothingItem;
    public bottom: ClothingItem;
    public shoes?: ClothingItem;
    public occasion: string; 
    public city?: string;

    public constructor(outfit: OutfitModel) {
        this.top = outfit.top;
        this.bottom = outfit.bottom;
        this.shoes = outfit.shoes;
        this.occasion = outfit.occasion;
        this.city = outfit.city || "Tel Aviv";
    }

    private static readonly validationSchema = Joi.object({
        top: Joi.object({
            type: Joi.string().required().min(2).max(255),
            color: Joi.string().required().min(2).max(255)
        }).required(),
        bottom: Joi.object({
            type: Joi.string().required().min(2).max(255),
            color: Joi.string().required().min(2).max(255)
        }).required(),
        shoes: Joi.object({
            type: Joi.string().optional().min(2).max(255),
            color: Joi.string().optional().min(2).max(255)
        }).optional(),
        occasion: Joi.string().required().min(2).max(100),
        city: Joi.string().optional().min(2).max(50)
    });

    public validate(): void {
        const result = OutfitModel.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}