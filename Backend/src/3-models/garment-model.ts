import Joi from "joi";
import { ValidationError } from "./client-errors";

export class GarmentModel {
    public id?: number;
    public category: "top" | "bottom" | "shoes";
    public name: string;
    public color: string;
    public fit: string;

    public constructor(garment: GarmentModel) {
        this.id = garment.id;
        this.category = garment.category;
        this.name = garment.name;
        this.color = garment.color;
        this.fit = garment.fit;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().positive(),
        category: Joi.string().valid("top", "bottom", "shoes").required(),
        name: Joi.string().min(2).max(250).required(),
        color: Joi.string().min(2).max(150).required(),
        fit: Joi.string().min(2).max(100).required()
    });

    public validate(): void {
        const result = GarmentModel.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}