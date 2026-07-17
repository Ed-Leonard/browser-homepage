export type HNItem = {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
  kids?: number[];
};

const VALID_TYPES = [
  "topstories",
  "newstories",
  "beststories",
  "askstories",
  "showstories",
  "jobstories",
] as const;
type StoryType = (typeof VALID_TYPES)[number];

const BASE = "https://hacker-news.firebaseio.com/v0";

async function fetchItem(id: number): Promise<HNItem | null> {
  const res = await fetch(`${BASE}/item/${id}.json`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type") ?? "topstories";
  const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 50);

  if (!VALID_TYPES.includes(typeParam as StoryType)) {
    return Response.json(
      { error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const idsRes = await fetch(`${BASE}/${typeParam}.json`, {
      next: { revalidate: 60 },
    });

    if (!idsRes.ok) {
      return Response.json(
        { error: `HN returned ${idsRes.status} fetching ${typeParam}` },
        { status: 502 },
      );
    }

    const allIds: number[] = await idsRes.json();
    const ids = allIds.slice(0, limit);

    const items = await Promise.all(ids.map(fetchItem));
    const posts = items.filter((item): item is HNItem => item !== null);

    return Response.json({ type: typeParam, posts });
  } catch (e) {
    console.error("HN fetch failed:", e);
    return Response.json(
      { error: "Failed to fetch from Hacker News" },
      { status: 500 },
    );
  }
}
