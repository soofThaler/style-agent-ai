import axios from "axios";
import { GarmentModel } from "../Models/GarmentModel";
import { appConfig } from "../Utils/AppConfig";

class WardrobeService {

    public async getAllGarments(): Promise<GarmentModel[]> {
        const response = await axios.get<GarmentModel[]>(appConfig.wardrobeUrl);
        return response.data;
    }

    public async addGarment(garment: GarmentModel): Promise<GarmentModel> {
        const response = await axios.post<GarmentModel>(appConfig.wardrobeUrl, garment);
        return response.data;
    }

    public async deleteGarment(id: number): Promise<void> {
        await axios.delete(`${appConfig.wardrobeUrl}/${id}`);
    }
}

export const wardrobeService = new WardrobeService();
