import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { Dialog, Autocomplete, TextField } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { HiOutlinePlus } from "react-icons/hi2";
import { getCached, setCached } from "../utility/cache";

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

const getPostImage = (post: Post) => {
  const preview = post.preview?.images?.[0]?.source?.url;
  if (preview) return preview.replace(/&amp;/g, "&");

  if (post.thumbnail?.startsWith("http")) return post.thumbnail;

  return null;
};

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
      className="p-2 cursor-pointer hover:bg-foreground/10 border-b border-foreground/10 mb-2 flex flex-row gap-2 items-center"
    >
      <img
        src={getPostImage(post) ?? undefined}
        alt=""
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        style={{ display: getPostImage(post) ? undefined : "none" }}
        className="h-16 w-16 object-contain rounded-sm shrink-0"
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
  const [showModal, setShowModal] = useState(false);

  const [subreddits, setSubreddits] = useState(
    localStorage.getItem("subreddits")?.split(",") ?? [
      "programming",
      "technology",
      "gaming",
      "GlobalOffensive",
    ],
  );
  useEffect(() => {
    localStorage.setItem("subreddits", subreddits.join(","));
  }, [subreddits]);

  const [input, setInput] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (input.length < 2) return setSuggestions([]);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/reddit?q=${input}`);
      const data = await res.json();
      const names = data.data.children.map((c: any) => c.data.display_name);
      setSuggestions(names);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const fetchMissing = async () => {
      setLoading(true);
      try {
        const missing = subreddits.filter(
          (sub) => !getCached<Post[]>(`posts:${sub}`, 1000 * 60 * 60), // 60 min
        );
        const results = await Promise.all(
          missing.map((sub) =>
            fetch(`/api/reddit?subreddit=${sub}&sort=hot&limit=5`)
              .then((r) => r.json())
              .then((data: RedditResponse) => {
                const posts = data.data.children.map((c) => c.data);
                setCached(`posts:${sub}`, posts);
                return [sub, posts] as const;
              }),
          ),
        );
        const fromCache = subreddits
          .filter((sub) => !missing.includes(sub))
          .map(
            (sub) =>
              [
                sub,
                getCached<Post[]>(`posts:${sub}`, 1000 * 60 * 60)!,
              ] as const,
          );

        setAllPosts((prev) => ({
          ...prev,
          ...Object.fromEntries([...results, ...fromCache]),
        }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchMissing();
  }, [subreddits]);

  const subRedditButton = (subreddit: string) => {
    return (
      <button
        className="p-2 text-lg font-mono tracking-tightest font-medium cursor-pointer hover:text-[#ff4500] transition-colors"
        onClick={() => setSubreddit(subreddit)}
        key={subreddit}
      >
        /r/{subreddit}
      </button>
    );
  };

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

      <div className="overflow-y-auto max-h-screen max-w-196">
        {loading && <div className="h-96 w-156">LOADING...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <div className="p-2">
            <div className="inline-flex gap-1">
              {subreddits.map(subRedditButton)}
              <GoPencil
                className="w-4 h-4 cursor-pointer transition-colors hover:text-[#ff4500]"
                onClick={() => setShowModal(true)}
              />
            </div>
            {posts.map((post, i) => (
              <PostCard key={post.permalink} post={post} index={i} />
            ))}
          </div>
        )}
        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => {
              setShowModal(false);
              setInput("");
            }}
            slotProps={{
              backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" } },
              paper: {
                sx: {
                  boxShadow: "none",
                  overflow: "visible",
                  backgroundColor: "transparent",
                  p: 2,
                },
              },
            }}
          >
            <div className="bg-background p-4 rounded-sm text-foreground flex flex-col gap-3 min-w-72">
              <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">
                Subreddits
                <span className="text-md text-foreground/30 lowercase ml-2">
                  (max 4)
                </span>
              </span>

              <div className="flex flex-col gap-1">
                {subreddits.map((sub) => (
                  <button
                    key={sub}
                    className="flex items-center justify-between px-2 py-1 rounded-sm hover:bg-foreground/5 group cursor-pointer"
                    onClick={() => {
                      setSubreddits((prev) => prev.filter((s) => s !== sub));
                      if (subreddit === sub)
                        setSubreddit(subreddits.find((s) => s !== sub) ?? "");
                    }}
                  >
                    <span className="font-mono">/r/{sub}</span>
                    <span
                      onClick={() => {
                        setSubreddits((prev) => prev.filter((s) => s !== sub));
                        if (subreddit === sub)
                          setSubreddit(subreddits.find((s) => s !== sub) ?? "");
                      }}
                      className="text-foreground/30 group-hover:text-[#ff4500] text-lg leading-none"
                    >
                      <RxCross1 className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = input.trim();
                  if (
                    trimmed &&
                    !subreddits.includes(trimmed) &&
                    subreddits.length < 4
                  ) {
                    setSubreddits((prev) => [...prev, trimmed]);
                  }
                  setInput("");
                }}
                className="flex items-center gap-2"
              >
                <Autocomplete
                  className="w-full"
                  disabled={subreddits.length >= 4}
                  freeSolo
                  options={suggestions}
                  inputValue={input}
                  onInputChange={(_, value) => setInput(value)}
                  onChange={(_, value) => {
                    if (
                      !value ||
                      subreddits.includes(value) ||
                      subreddits.length >= 4
                    )
                      return;
                    setSubreddits((prev) => [...prev, value]);
                    setInput("");
                    setSuggestions([]);
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        boxShadow: "none",
                        border:
                          "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                        borderRadius: "2px",
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Add subreddit..."
                      size="small"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "var(--foreground)",
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                          borderRadius: "2px",
                          "& fieldset": {
                            borderColor:
                              "color-mix(in srgb, var(--foreground) 20%, transparent)",
                          },
                          "&:hover fieldset": {
                            borderColor:
                              "color-mix(in srgb, var(--foreground) 40%, transparent)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor:
                              "color-mix(in srgb, var(--foreground) 70%, transparent)",
                            borderWidth: "1px",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color:
                            "color-mix(in srgb, var(--foreground) 40%, transparent)",
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                />
                <button
                  type="submit"
                  className="circle-button hover:text-[#ff4500] disabled:text-foreground/30 disabled:hover:text-foreground/30 disabled:cursor-default"
                  disabled={subreddits.length >= 4}
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </Dialog>
        )}
      </div>
    </>
  );
}
