export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subreddit = searchParams.get("subreddit") ?? "programming";
  const sort = searchParams.get("sort") ?? "hot";
  const limit = searchParams.get("limit") ?? "5";

  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`,
    { headers: { "User-Agent": "web:my-react-app:v1.0 (by /u/typO)" } },
  );

  const data = await res.json();
  return Response.json(data);
}
