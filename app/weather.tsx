'use client';

import { useState, useEffect } from 'react';

export default function CurrentWeather({ celsius }: { celsius: boolean }) {
	const [temperature, setTemperature] = useState<number | null>(null);

	const toFahrenheit = (c: number) => ((c * 9 / 5) + 32).toFixed(0);

	useEffect(() => {
		const fetchWeather = async (lat: number, lon: number) => {
			const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
			const data = await res.json();
			setTemperature(data.current.temperature_2m);
		};

		if (process.env.NODE_ENV === 'development') {
			fetchWeather(-43, 173);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => fetchWeather(position.coords.latitude, position.coords.longitude),
			(error) => console.error('Geolocation error:', error.message)
		);
	}, [celsius]);

	return (
		<div className='p-2 font-light font-mono text-2xl rounded-lg'>
			{temperature !== null ? `${celsius ? temperature : toFahrenheit(temperature)}${celsius ? '°C' : '°F'}` : 'Loading...'}
		</div>
	);
}
