class AppConfig {
    public readonly baseUrl = "http://localhost:4000/api";
    public readonly wardrobeUrl = this.baseUrl + "/wardrobe";
    public readonly stylistUrl = this.baseUrl + "/stylist";
}

export const appConfig = new AppConfig();