export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const lat = searchParams.get("lat");
	const lon = searchParams.get("lon");

	const res = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`
	);
	const data = await res.json();
	return Response.json(data);
}
