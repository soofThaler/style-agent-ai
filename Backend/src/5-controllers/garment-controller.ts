import express, { Request, Response, NextFunction } from "express";
import { garmentService } from "../4-services/garment-service";
import { GarmentModel } from "../3-models/garment-model";
import { StatusCode } from "../3-models/enums";

export const garmentRouter = express.Router();

// 1. GET all wardrobe garments: GET /api/wardrobe
garmentRouter.get("/wardrobe", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const garments = await garmentService.getAllGarments();
        res.json(garments);
    } catch (err: any) {
        next(err);
    }
});

// 2. GET garments by category: GET /api/wardrobe/category/:category (top / bottom / shoes)
garmentRouter.get("/wardrobe/category/:category", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = req.params.category as "top" | "bottom" | "shoes";
        const garments = await garmentService.getGarmentsByCategory(category);
        res.json(garments);
    } catch (err: any) {
        next(err);
    }
});

// 3. POST add garment to wardrobe: POST /api/wardrobe
garmentRouter.post("/wardrobe", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const garment = new GarmentModel(req.body);
        const addedGarment = await garmentService.addGarment(garment);
        res.status(StatusCode.Created).json(addedGarment);
    } catch (err: any) {
        next(err);
    }
});

// 4. DELETE garment from wardrobe: DELETE /api/wardrobe/:id
garmentRouter.delete("/wardrobe/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        await garmentService.deleteGarment(id);
        res.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
        next(err);
    }
});