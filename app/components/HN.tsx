import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { getCached, setCached } from "../utility/cache";

type Post = {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
};

type HNApiResponse = {
  type: string;
  posts: Post[];
};

const STORY_TYPES = [
  { key: "topstories", label: "Top" },
  { key: "newstories", label: "New" },
  { key: "beststories", label: "Best" },
  { key: "askstories", label: "Ask HN" },
  { key: "showstories", label: "Show HN" },
  { key: "jobstories", label: "Jobs" },
] as const;

type StoryTypeKey = (typeof STORY_TYPES)[number]["key"];

function formatScore(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function timeAgo(unixSeconds: number): string {
  const diffMs = Date.now() - unixSeconds * 1000;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getHostname(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const commentsUrl = `https://news.ycombinator.com/item?id=${post.id}`;
  const hostname = getHostname(post.url);

  return (
    <div
      onClick={() => (window.location.href = post.url ?? commentsUrl)}
      style={{
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 60}ms`,
      }}
      className="p-2 cursor-pointer hover:bg-foreground/10 border-b border-foreground/10 mb-2 flex flex-col gap-1"
    >
      <h2 className="font-semibold">{post.title}</h2>
      <div className="inline-flex gap-1 flex-wrap items-center text-sm">
        <span style={{ color: "#888" }}>by {post.by}</span>
        <span>·</span>
        <span style={{ color: "#ff6600" }}>▲ {formatScore(post.score)}</span>
        <span>·</span>
        <span>{timeAgo(post.time)}</span>
        <span>·</span>
        <a
          href={commentsUrl}
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="hover:text-[#ff6600] transition-colors duration-100"
        >
          {post.descendants ?? 0} comments
        </a>
        {hostname && (
          <>
            <span>·</span>
            <a
              href={post.url}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#ff6600] transition-colors duration-100 inline-flex items-center gap-1"
            >
              {hostname}
              <MdArrowOutward className="w-3 h-3 text-[#ff6600]" />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function HNFeed() {
  const [allPosts, setAllPosts] = useState<Record<StoryTypeKey, Post[]>>(
    {} as Record<StoryTypeKey, Post[]>,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<StoryTypeKey>("topstories");

  useEffect(() => {
    const fetchIfMissing = async () => {
      setLoading(true);
      try {
        const cached = getCached<Post[]>(`hn:${activeType}`, 1000 * 60 * 5);
        if (cached) {
          setAllPosts((prev) => ({ ...prev, [activeType]: cached }));
          return;
        }

        const res = await fetch(`/api/hn?type=${activeType}&limit=5`);
        const data: HNApiResponse = await res.json();
        if (!res.ok) throw new Error((data as any).error ?? "Failed to load");

        setCached(`hn:${activeType}`, data.posts);
        setAllPosts((prev) => ({ ...prev, [activeType]: data.posts }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchIfMissing();
  }, [activeType]);

  const storyTypeButton = (type: (typeof STORY_TYPES)[number]) => (
    <button
      key={type.key}
      className={`p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer transition-colors ${
        activeType === type.key ? "text-[#ff6600]" : "hover:text-[#ff6600]"
      }`}
      onClick={() => setActiveType(type.key)}
    >
      {type.label}
    </button>
  );

  const posts = allPosts[activeType] ?? [];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div className="overflow-y-auto max-h-screen max-w-196">
        <div className="p-2">
          <div className="inline-flex gap-1">
            {STORY_TYPES.map(storyTypeButton)}
          </div>

          {loading && <div className="h-96 w-156">LOADING...</div>}
          {error && <div>Error: {error}</div>}
          {!loading &&
            !error &&
            posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
        </div>
      </div>
    </>
  );
}
