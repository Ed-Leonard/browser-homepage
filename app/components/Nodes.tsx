"use client";

import Draggable from "react-draggable";
import { NodeEntry, NodePropsMap } from "./ComponentMap";
import { useRef, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import LeetDaily from "./Leet";
import CurrentWeather from "./Weather";
import ShortcutsElement from "./Shortcuts";
import HNElement from "./HN";
import WordOfTheDayElement from "./WordOfTheDay";
import { CiSettings } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

type DraggableBoxProps = NodeEntry & {
  node: React.ComponentType<any>;
  onClick: () => void;
  onMove: (x: number, y: number) => void;
  onToggleShowing: () => void;
};

type FieldDef =
  | { type: "toggle"; label: string }
  | { type: "enum"; label: string; options: string[] };

export function Clock(props: NodePropsMap["Clock"]) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      let suffix = "";

      if (!props.use24Hour) {
        suffix = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12;
      }

      const hh = hours.toString().padStart(2, "0");
      const mm = minutes.toString().padStart(2, "0");
      const ss = seconds.toString().padStart(2, "0");

      const formatted = props.showSeconds
        ? `${hh}:${mm}:${ss}${suffix}`
        : `${hh}:${mm}${suffix}`;

      setTime(formatted);
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [props.showSeconds, props.use24Hour]);

  return (
    <div
      className={`${props.fontSize} noselect p-2 rounded-lg ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      {time}
    </div>
  );
}

export function Leet(props: NodePropsMap["Leet"]) {
  return (
    <div
      className={`rounded-lg ${props.border ? "border" : "border-0"} ${props.shadow}`}
    >
      <LeetDaily />
    </div>
  );
}

export function Weather(props: NodePropsMap["Weather"]) {
  return (
    <div
      className={`${props.fontSize} rounded-lg ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      <CurrentWeather celsius={props.celsius} />
    </div>
  );
}

export function GoogleSearch(props: NodePropsMap["GoogleSearch"]) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>, value: string) => {
    e.preventDefault();
    const val = value.trim();
    const isURL =
      /^(https?:\/\/|www\.)\S+/.test(val) || /^[^\s]+\.[^\s]+/.test(val);
    const dest = isURL
      ? val.startsWith("http")
        ? val
        : "https://" + val
      : `https://www.google.com/search?q=${encodeURIComponent(val)}`;
    window.location.href = dest;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={`${props.fontSize} rounded-lg ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow} p-2 group border-foreground/40 focus-within:border-foreground focus-within:shadow-secondary/50 transition-all duration-300 hover:border-foreground`}
    >
      <form
        className="inline-flex items-center"
        onSubmit={(e) => onSubmit(e, value)}
      >
        <input
          ref={inputRef}
          autoComplete="url"
          type="text"
          name="q"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="focus:outline-none focus:ring-foreground/20 text-center focus:placeholder-transparent"
        />
      </form>
    </div>
  );
}

export function Shortcuts(props: NodePropsMap["Shortcuts"]) {
  return (
    <div
      className={`rounded-lg ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      <ShortcutsElement />
    </div>
  );
}

export function HN(props: NodePropsMap["HN"]) {
  return (
    <div
      className={`rounded-lg ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      <HNElement />
    </div>
  );
}

export function WordOfTheDay(props: NodePropsMap["WordOfTheDay"]) {
  return (
    <div
      className={`rounded-lg p-3 max-w-xs ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow} ${props.fontSize}`}
    >
      <WordOfTheDayElement />
    </div>
  );
}

export function Sketchpad(props: NodePropsMap["Sketchpad"]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    const saved = localStorage.getItem("sketch");
    if (!canvas || !ctx || !saved) return;

    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = saved;
  }, []);

  useEffect(() => {
    const stop = () => {
      drawingRef.current = false;
    };
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  const saveSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    localStorage.setItem("sketch", canvas.toDataURL("image/png"));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    drawingRef.current = true;
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || e.buttons !== 1) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (drawingRef.current) saveSketch();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem("sketch");
  };

  return (
    <div
      className={`rounded-lg p-3 max-w-md ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <input
          className="cursor-pointer"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          className="cursor-pointer"
          type="range"
          min="1"
          max="30"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
        />
        <span>{strokeWidth}px</span>
        <button onClick={handleClear} className="cursor-pointer">
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width="500"
        height="400"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
}

export function Notepad(props: NodePropsMap["Notepad"]) {
  const [notes, setNotes] = useState<string[]>(
    localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes") as string)
      : [""],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, 500);

    return () => {
      clearTimeout(timeout);
      localStorage.setItem("notes", JSON.stringify(notes));
    };
  }, [notes]);

  return (
    <div
      className={`rounded-lg p-3 max-w-md ${props.border ? "border" : "border-0"} ${props.background ? "bg-secondary" : "bg-transparent"} ${props.shadow}`}
    >
      {notes.map((n, i) => (
        <div key={i} className="w-full inline-flex items-center my-1">
          <textarea
            className="w-full focus:outline-none hover:bg-foreground/10 focus:bg-foreground/10 rounded-lg p-2 focus:shadow-xl"
            value={n}
            onChange={(e) =>
              setNotes((prev) =>
                prev.map((n, j) => (j === i ? e.target.value : n)),
              )
            }
          ></textarea>
          <button
            className="bg-secondary rounded-full p-1 ml-2 hover:bg-red-400 cursor-pointer transition-colors"
            onClick={() => setNotes((prev) => prev.filter((_, j) => j !== i))}
          >
            <RxCross1 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        className="cursor-pointer hover:bg-foreground/10 transition p-2 w-full text-left mt-2"
        onClick={() => setNotes([...notes, ""])}
      >
        + Add note
      </button>
    </div>
  );
}

function EnumField({
  fieldKey,
  field,
  props,
  onChange,
}: {
  fieldKey: string;
  field: Extract<FieldDef, { type: "enum" }>;
  props: any;
  onChange?: (updated: any) => void;
}) {
  const currentVal = props[fieldKey] as string;
  const idx = field.options.findIndex((o) => o === currentVal);

  return (
    <div className="flex justify-between items-center w-full p-2 border-b rounded-bl-lg">
      <span>{field.label}</span>
      <div className="gap-2 flex text-lg w-min">
        <button
          className="cursor-pointer border-b-2 px-1 border-b-background hover:border-b-foreground transition-colors"
          onClick={() => {
            if (idx > 0) onChange?.({ [fieldKey]: field.options[idx - 1] });
          }}
        >
          −
        </button>
        <button
          className="cursor-pointer  border-b-2 px-1 border-b-background hover:border-b-foreground transition-colors"
          onClick={() => {
            if (idx < field.options.length - 1)
              onChange?.({ [fieldKey]: field.options[idx + 1] });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function DraggableBox({
  props,
  node: Node,
  x,
  y,
  z,
  onChange,
  onClick,
  onMove,
  onToggleShowing,
}: DraggableBoxProps) {
  const nodeRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  const toggleFields: Record<string, FieldDef> = {
    showSeconds: { type: "toggle", label: "Show Seconds" },
    use24Hour: { type: "toggle", label: "24 Hour" },
    border: { type: "toggle", label: "Border" },
    background: { type: "toggle", label: "Background" },
    celsius: { type: "toggle", label: "Celsius" },
    shadow: {
      type: "enum",
      label: "Shadow",
      options: [
        "shadow-none",
        "shadow-sm",
        "shadow-md",
        "shadow-lg",
        "shadow-xl",
        "shadow-2xl",
      ],
    },
    fontSize: {
      type: "enum",
      label: "Font Size",
      options: [
        "text-sm",
        "text-md",
        "text-lg",
        "text-xl",
        "text-2xl",
        "text-3xl",
        "text-4xl",
        "text-5xl",
        "text-6xl",
      ],
    },
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        handle=".header"
        bounds="parent"
        onMouseDown={onClick}
        position={{ x, y }}
        onStop={(_, data) => {
          onMove(data.x, data.y);
        }}
      >
        <div
          ref={nodeRef}
          className={`window group absolute`}
          style={{ zIndex: z }}
        >
          <div className="header opacity-0 pb-1 px-1 group-hover:opacity-100 flex justify-between cursor-grab active:cursor-grabbing border-t border-transparent hover:border-foreground active:border-foreground transition-all rounded-xl">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="circle-button hover:rotate-90 transition-transform"
            >
              <CiSettings />
            </button>
            <button className="circle-button" onClick={() => onToggleShowing()}>
              <RxCross1 />
            </button>
          </div>
          <Node {...props} />
        </div>
      </Draggable>

      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" } },
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
        <Draggable nodeRef={nodeRef}>
          <div className="bg-background p-4 text-foreground rounded-lg border cursor-move">
            {Object.entries(toggleFields).map(([key, field]) =>
              key in props ? (
                field.type === "toggle" ? (
                  <label
                    key={key}
                    className="flex gap-32 justify-between items-center w-full cursor-pointer p-2 border-b rounded-bl-lg hover:bg-[#1d2021]"
                  >
                    <span className="text-lg noselect">{field.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(props[key as keyof typeof props])}
                      onChange={(e) =>
                        onChange?.({ [key]: e.target.checked } as Partial<
                          typeof props
                        >)
                      }
                      className="cursor-pointer bg-background border rounded-full size-2 appearance-none checked:bg-foreground transition-all duration-75"
                    />
                  </label>
                ) : (
                  <EnumField
                    key={key}
                    fieldKey={key}
                    field={field}
                    props={props}
                    onChange={onChange}
                  />
                )
              ) : null,
            )}
          </div>
        </Draggable>
      </Dialog>
    </>
  );
}
