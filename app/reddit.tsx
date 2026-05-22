import { url } from "inspector";
import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

const SUBREDDITS = ["programming", "technology", "gaming", "GlobalOffensive"];

type PreviewImage = {
  source: { url: string; width: number; height: number };
  resolutions: { url: string; width: number; height: number }[];
};

type Post = {
  title: string;
  url: string;
  permalink: string;
  selftext: string;
  score: number;
  num_comments: number;
  author: string;
  subreddit: string;
  created_utc: number;
  is_self: boolean;
  thumbnail: string;
  preview?: { images: PreviewImage[]; enabled: boolean };
};

type RedditResponse = {
  data: {
    children: { data: Post }[];
    after: string | null;
  };
};

function formatScore(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <div
      onClick={() =>
        (window.location.href = `https://reddit.com${post.permalink}`)
      }
      style={{
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 60}ms`,
      }}
      className="p-2 cursor-pointer hover:bg-foreground/10 border-b border-foreground/10 mb-2 flex flex-row gap-2"
    >
      <img
        src={post.url ?? undefined}
        alt=""
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        className="h-12 w-12 rounded-sm shadow-sm"
      />
      <div className="flex flex-col">
        <h2 className="font-semibold">{post.title}</h2>
        <div className="inline-flex gap-1">
          <span style={{ color: "#888" }}>u/{post.author}</span>
          <span>·</span>
          <span style={{ color: "#ff4500" }}>▲ {formatScore(post.score)}</span>
          <span>·</span>
          <span>{post.num_comments} comments</span>
          <span>·</span>
          <a
            href={post.url}
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[#ff4500] transition-colors duration-100 inline-flex items-center gap-1"
          >
            {new URL(post.url).hostname}
            <MdArrowOutward className="w-3 h-3 text-[#ff4500]" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RedditFeed() {
  const [allPosts, setAllPosts] = useState<Record<string, Post[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subreddit, setSubreddit] = useState("programming");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          SUBREDDITS.map((sub) =>
            fetch(`/api/reddit?subreddit=${sub}&sort=hot&limit=5`)
              .then((r) => r.json())
              .then(
                (data: RedditResponse) =>
                  [sub, data.data.children.map((c) => c.data)] as const,
              ),
          ),
        );
        setAllPosts(Object.fromEntries(results));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const posts = allPosts[subreddit] ?? [];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div className="overflow-y-auto max-h-screen">
        {loading && <div className="h-96 w-156">LOADING...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <div className="p-2">
            <div className="inline-flex gap-1">
              <button
                className="p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer hover:text-[#ff4500] transition-colors"
                onClick={() => setSubreddit("programming")}
              >
                /r/Programming
              </button>
              <button
                className="p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer hover:text-[#ff4500] transition-colors"
                onClick={() => setSubreddit("technology")}
              >
                /r/Technology
              </button>
              <button
                className="p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer hover:text-[#ff4500] transition-colors"
                onClick={() => setSubreddit("gaming")}
              >
                /r/Games
              </button>
              <button
                className="p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer hover:text-[#ff4500] transition-colors"
                onClick={() => setSubreddit("GlobalOffensive")}
              >
                /r/CSGO
              </button>
            </div>
            {posts.map((post, i) => (
              <PostCard key={post.permalink} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
