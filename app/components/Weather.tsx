"use client";
import { useState, useEffect } from "react";
import { getCached, setCached } from "../utility/cache";

const CACHE_KEY = "weather";
const CACHE_TTL_MS = 10 * 60 * 1000;

export default function CurrentWeather({ celsius }: { celsius: boolean }) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const toFahrenheit = (c: number) => ((c * 9) / 5 + 32).toFixed(0);

  useEffect(() => {
    const cached = getCached<number>(CACHE_KEY, CACHE_TTL_MS);
    if (cached !== null) {
      setTemperature(cached);
      return;
    }

    const fetchWeather = async (lat: number, lon: number) => {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const temp = data.current.temperature_2m;
      setCached(CACHE_KEY, temp);
      setTemperature(temp);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error("Geolocation error:", err.message),
    );
  }, []);

  return (
    <div className="p-2 font-light font-mono rounded-lg">
      {temperature !== null
        ? `${celsius ? temperature : toFahrenheit(temperature)}${celsius ? "°C" : "°F"}`
        : ""}
    </div>
  );
}
