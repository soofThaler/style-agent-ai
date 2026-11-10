import axios from "axios";

export interface WeatherInfo {
    city: string;
    temperatureC: number;
    description: string;
}

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    "tel aviv": { lat: 32.0853, lon: 34.7818 },
    "jerusalem": { lat: 31.7683, lon: 35.2137 },
    "haifa": { lat: 32.7940, lon: 34.9896 },
    "beer sheva": { lat: 31.2529, lon: 34.7915 },
    "new york": { lat: 40.7128, lon: -74.0060 },
    "london": { lat: 51.5074, lon: -0.1278 },
    "paris": { lat: 48.8566, lon: 2.3522 },
    "tokyo": { lat: 35.6762, lon: 139.6503 }
};

export async function fetchLiveWeather(cityName?: string): Promise<WeatherInfo | null> {
    try {
        const query = (cityName || "tel aviv").toLowerCase().trim();
        const coords = CITY_COORDS[query] || CITY_COORDS["tel aviv"];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`;
        const response = await axios.get(url, { timeout: 3000 });

        const current = response.data?.current;
        if (!current) return null;

        const temp = Math.round(current.temperature_2m);
        const code = current.weather_code;

        let description = "Clear skies";
        if (code >= 1 && code <= 3) description = "Partly cloudy";
        else if (code >= 45 && code <= 48) description = "Foggy";
        else if (code >= 51 && code <= 67) description = "Rainy / Showers";
        else if (code >= 71) description = "Snowy / Cold";

        return {
            city: cityName || "Tel Aviv",
            temperatureC: temp,
            description
        };
    } catch {
        return null;
    }
}