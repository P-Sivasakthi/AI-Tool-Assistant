import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const weatherTool = tool(
  async ({ city }) => {
    console.log("1111111111111111111111111111")
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    if (!geoResponse.ok) {
      throw new Error("Weather geocoding request failed");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results?.length) {
      return JSON.stringify({
        city,
        error: "City not found"
      });
    }

    const location = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather forecast request failed");
    }

    const weatherData = await weatherResponse.json();

    return JSON.stringify({
      city: `${location.name}${location.admin1 ? `, ${location.admin1}` : ""}`,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      wind: `${weatherData.current.wind_speed_10m} km/h`,
      weatherCode: weatherData.current.weather_code
    });
  },
  {
    name: "get_weather",
    description: "Get the current weather for a city.",
    schema: z.object({
      city: z.string()
    })
  }
);
