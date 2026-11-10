import cors from "cors";
import express from "express";
import { appConfig } from "./2-utils/app-config";
import { controller } from "./5-controllers/controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { garmentRouter } from "./5-controllers/garment-controller";

class App {

    public start(): void {
        try {
            const server = express();
            server.use(cors());
            server.use(express.json({ limit: "10mb" }));
            server.use(controller.router);
            server.use("/api",garmentRouter);
            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);
            server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
        }
        catch (err: any) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();
