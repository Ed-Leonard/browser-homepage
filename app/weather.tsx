'use client';

import { useState, useEffect } from 'react';

export default function CurrentWeather() {
	const [temperature, setTemperature] = useState<number | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
			const data = await res.json();
			setTemperature(data.current.temperature_2m);
		});
	}, []);

	return (
		<div className='p-2 rounded-lg bg-[#3c3836]'>
			{temperature !== null ? `${temperature}°C` : 'Loading...'}
		</div>
	);
}
