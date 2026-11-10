import { dal } from "../2-utils/dal";
import { GarmentModel } from "../3-models/garment-model";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { OkPacketParams } from "mysql2";

class GarmentService {

    // 1. Get all garments in user wardrobe
    public async getAllGarments(): Promise<GarmentModel[]> {
        const sql = "SELECT * FROM `garments` ORDER BY `category`, `name`";
        const garments = await dal.execute(sql);
        return garments as GarmentModel[];
    }

    // 2. Get garments filtered by category (top / bottom / shoes)
    public async getGarmentsByCategory(category: "top" | "bottom" | "shoes"): Promise<GarmentModel[]> {
        const sql = "SELECT * FROM `garments` WHERE `category` = ?";
        const garments = await dal.execute(sql, [category]);
        return garments as GarmentModel[];
    }

    // 3. Add a new garment to wardrobe
    public async addGarment(garment: GarmentModel): Promise<GarmentModel> {
        garment.validate();

        const sql = `
            INSERT INTO \`garments\` (\`category\`, \`name\`, \`color\`, \`fit\`)
            VALUES (?, ?, ?, ?)
        `;
        const values = [garment.category, garment.name, garment.color, garment.fit];
        
        const info = await dal.execute(sql, values) as OkPacketParams;
        garment.id = info.insertId;

        return garment;
    }

    // 4. Delete a garment by ID
    public async deleteGarment(id: number): Promise<void> {
        const sql = "DELETE FROM `garments` WHERE `id` = ?";
        const info = await dal.execute(sql, [id]) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }
}

export const garmentService = new GarmentService();