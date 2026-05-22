"use client";

import { useState, useEffect } from "react";

let cache: number | null = null;

export default function CurrentWeather({ celsius }: { celsius: boolean }) {
  const [temperature, setTemperature] = useState<number | null>(cache);

  const toFahrenheit = (c: number) => ((c * 9) / 5 + 32).toFixed(0);

  useEffect(() => {
    if (cache) return;
    const fetchWeather = async (lat: number, lon: number) => {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      cache = data.current.temperature_2m;
      setTemperature(data.current.temperature_2m);
    };

    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeather(position.coords.latitude, position.coords.longitude),
      (error) => console.error("Geolocation error:", error.message),
    );
  }, [celsius]);

  return (
    <div className="p-2 font-light font-mono rounded-lg">
      {temperature !== null
        ? `${celsius ? temperature : toFahrenheit(temperature)}${celsius ? "°C" : "°F"}`
        : ""}
    </div>
  );
}
