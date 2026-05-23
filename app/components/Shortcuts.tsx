import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { Dialog } from "@mui/material";
import { GoPencil } from "react-icons/go";

type Shortcut = {
  name: string;
  url: string;
  iconUrl: string;
};

export default function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("shortcuts") ?? "[]");
  });
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState<Shortcut | null>(null);

  const addShortcut = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    const domain = new URL(fullUrl).hostname;
    const raw = domain.replace(/^www\./, "").split(".")[0];
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    const newShortcut = { name, url: fullUrl, iconUrl };

    const next = editing
      ? shortcuts.map((s) => (s.url === editing.url ? newShortcut : s))
      : [...shortcuts, newShortcut];

    setShortcuts(next);
    localStorage.setItem("shortcuts", JSON.stringify(next));
    setEditing(null);
  };

  return (
    <div className="flex flex-wrap">
      {shortcuts?.map((s) => (
        <a
          key={s.url}
          href={s.url}
          className="cursor-pointer w-24 h-24 flex flex-col justify-center items-center text-sm bg-background m-1 rounded-xl hover:bg-foreground/10 relative group/shortcut"
        >
          <img
            src={s.iconUrl}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
            alt={s.name}
            className="flex items-center justify-center text-foreground w-fill"
          ></img>
          <div>{s.name}</div>
          <button
            className="absolute top-1 left-1 p-1 cursor-pointer hover:bg-foreground/10 rounded-full group-hover/shortcut:block hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const next = shortcuts.filter(
                (shortcut) => s.url !== shortcut.url,
              );
              setShortcuts(next);
              localStorage.setItem("shortcuts", JSON.stringify(next));
            }}
          >
            <RxCross1 />
          </button>
          <button
            className="absolute top-1 right-1 p-1 cursor-pointer hover:bg-foreground/10 rounded-full group-hover/shortcut:block hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditing(s);
              setInput(s.url);
              setShowModal(true);
            }}
          >
            <GoPencil />
          </button>
        </a>
      ))}
      <button
        className="cursor-pointer w-24 h-24 flex flex-col items-center text-xs bg-background m-1 rounded-xl hover:bg-foreground/10 justify-center"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-center bg-foreground/20 text-foreground h-12 w-12 rounded-full m-1">
          <HiOutlinePlus />
        </div>
        Add Shortcut
      </button>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addShortcut(input);
              setInput("");
              setShowModal(false);
            }}
            className="bg-background p-2 rounded-sm text-foreground inline-flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="URL..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-lg w-64 p-1 focus:outline-none ring-2 rounded-sm ring-foreground/20 focus:ring-foreground/70"
            />
            <button
              type="submit"
              className="p-2 rounded-full hover:bg-foreground/10 cursor-pointer"
            >
              <HiOutlinePlus />
            </button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
