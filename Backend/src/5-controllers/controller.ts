import express, { Request, Response, NextFunction, Router } from "express";
import { OutfitModel } from "../3-models/outfit-model";
import { service } from "../4-services/service";

class Controller {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/stylist/ping", this.ping);
        this.router.post("/api/stylist/analyze", this.analyze);
        this.router.post("/api/stylist/analyze-image", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const result = await service.analyzeOutfitFromImage(request.body);
        response.json(result);
    }
    catch (err: any) {
        next(err);
    }
        });
        this.router.post("/api/stylist/style-me", async (request: Request, response: Response, next: NextFunction) => {
            try {
                const result = await service.generateOutfitFromWardrobe(request.body);
                response.json(result);
            } catch (err: any) {
                next(err);
            }
        });
    }

    private async ping(request: Request, response: Response) {
        response.json({ message: "Stylist server is alive and ready!" });
    }

    private async analyze(request: Request, response: Response, next: NextFunction) {
        try {
            const outfit = new OutfitModel(request.body);
            const feedback = await service.analyzeOutfit(outfit);
            response.json(feedback);
        } catch (err: any) {
            next(err);
        }
    }

}

export const controller = new Controller();