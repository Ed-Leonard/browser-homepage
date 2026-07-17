"use client";

import DraggableBox from "./components/Nodes";
import TaskBar from "./components/Taskbar";
import { useState, useEffect } from "react";
import {
  componentMap,
  NodeEntry,
  NodePropsMap,
} from "./components/ComponentMap";
import { ThemeProvider } from "./context/ThemeContext";
import { CiSettings } from "react-icons/ci";
import { useTheme, type Theme, type Font } from "./context/ThemeContext";
import { Dialog } from "@mui/material";
import { FiClock } from "react-icons/fi";
import { FaCloudSunRain } from "react-icons/fa";
import { IoSearchSharp, IoLink } from "react-icons/io5";
import { LuLetterText } from "react-icons/lu";
import { BsPencilSquare } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";

const fontSize: string[] = [
  "text-sm",
  "text-md",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
];

const shadowSize: string[] = [
  "shadow-none",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];

const getDefaultNodes = (): NodeEntry[] =>
  [
    {
      nodeName: "Clock",
      icon: <FiClock />,
      props: {
        showSeconds: true,
        use24Hour: false,
        border: true,
        background: true,
        fontSize: fontSize[6],
        shadow: shadowSize[3],
      },
      x: 1500,
      y: 50,
      z: 1,
      showing: true,
    },
    {
      nodeName: "Leet",
      icon: (
        <img
          src={`https://favicon.im/leetcode.com?larger=true`}
          className="w-6 h-6"
        />
      ),
      props: { border: true, shadow: shadowSize[3] },
      x: 1400,
      y: 400,
      z: 3,
      showing: true,
    },
    {
      nodeName: "Weather",
      icon: <FaCloudSunRain />,
      props: {
        border: true,
        background: true,
        celsius: true,
        fontSize: fontSize[4],
        shadow: shadowSize[3],
      },
      x: 1600,
      y: 150,
      z: 4,
      showing: true,
    },
    {
      nodeName: "GoogleSearch",
      icon: <IoSearchSharp />,
      props: {
        border: true,
        background: true,
        fontSize: fontSize[4],
        shadow: shadowSize[3],
      },
      x: 700,
      y: 80,
      z: 5,
      showing: true,
    },
    {
      nodeName: "Shortcuts",
      icon: <IoLink />,
      props: {
        border: true,
        background: true,
        shadow: shadowSize[3],
      },
      x: 700,
      y: 400,
      z: 6,
      showing: false,
    },
    {
      nodeName: "HN",
      icon: (
        <img
          src={`https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=64`}
          className="w-6 h-6 "
        />
      ),
      props: {
        border: true,
        background: true,
        shadow: shadowSize[3],
      },
      x: 50,
      y: 400,
      z: 7,
      showing: true,
    },
    {
      nodeName: "WordOfTheDay",
      icon: <LuLetterText />,
      props: {
        border: true,
        background: true,
        fontSize: fontSize[4],
        shadow: shadowSize[3],
      },
      x: 50,
      y: 20,
      z: 8,
      showing: true,
    },
    {
      nodeName: "Sketchpad",
      icon: <BsPencil />,
      props: {
        border: true,
        background: true,
        shadow: shadowSize[3],
      },
      x: 800,
      y: 400,
      z: 9,
      showing: false,
    },
    {
      nodeName: "Notepad",
      icon: <BsPencilSquare />,
      props: {
        border: true,
        background: true,
        shadow: shadowSize[3],
      },
      x: 700,
      y: 300,
      z: 10,
      showing: false,
    },
  ] as NodeEntry[];

export default function Home() {
  const [nodes, setNodes] = useState<NodeEntry[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme, font, setFont } = useTheme();

  useEffect(() => {
    const defaults = getDefaultNodes();
    const saved = localStorage.getItem("nodes");
    let loadedNodes = defaults.map((n) => ({ ...n }));

    if (saved) {
      try {
        const parsed: NodeEntry[] | null = JSON.parse(saved);
        if (parsed) {
          loadedNodes = defaults.map((defaultNode) => {
            const savedNode = parsed.find(
              (n) => n.nodeName === defaultNode.nodeName,
            );
            if (savedNode) {
              return {
                ...defaultNode,
                ...savedNode,
                icon: defaultNode.icon,
                props: {
                  ...defaultNode.props,
                  ...savedNode.props,
                },
              };
            }
            return { ...defaultNode };
          }) as NodeEntry[];
        }
      } catch (error) {
        console.error("Failed to parse saved nodes:", error);
      }
    }

    setNodes(
      loadedNodes.map((n, i) => ({
        ...n,
        onChange: (newProps: any) => {
          setNodes((prev) =>
            prev.map((p, j) =>
              i === j ? { ...p, props: { ...p.props, ...newProps } } : p,
            ),
          );
        },
      })) as NodeEntry[],
    );
  }, []);

  useEffect(() => {
    if (nodes.length) {
      const clean = nodes.map(({ onChange, ...rest }) => rest);
      localStorage.setItem("nodes", JSON.stringify(clean));
    }
  }, [nodes]);

  const [highestZ, setHighestZ] = useState(10);

  const bringToFront = (index: number) => {
    setNodes((prev) =>
      prev.map((w, i) => (i === index ? { ...w, z: highestZ + 1 } : w)),
    );
    setHighestZ((z) => z + 1);
    console.log(highestZ);
  };

  const moveNode = (index: number, x: number, y: number) => {
    setNodes((prev) => prev.map((n, i) => (i === index ? { ...n, x, y } : n)));
  };

  const toggleNodeShowing = (index: number) => {
    setNodes((prev) =>
      prev.map((n, i) => (i === index ? { ...n, showing: !n.showing } : n)),
    );
  };

  const updateNodeProps = (
    index: number,
    updated: Partial<NodePropsMap[keyof NodePropsMap]>,
  ) => {
    setNodes((prev) =>
      prev.map((n, i) =>
        i === index
          ? ({ ...n, props: { ...n.props, ...updated } } as NodeEntry)
          : n,
      ),
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <button
        className="absolute top-6 right-6 text-foreground circle-button hover:rotate-90 transition-transform"
        onClick={() => setShowSettings(!showSettings)}
      >
        <CiSettings />
      </button>
      {showSettings && (
        <Dialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          slotProps={{
            paper: {
              sx: {
                boxShadow: "none",
                overflow: "visible",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                p: 2,
                border: "1px solid var(--foreground)",
                borderRadius: "0.2rem",
              },
            },
          }}
        >
          <div className="flex flex-col gap-2 text-lg">
            <div className="flex gap-4 justify-between">
              <span>Theme</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="text-center cursor-pointer hover:bg-foreground/10 rounded-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="gruvbox">Gruvbox</option>
                <option value="silk">Silk</option>
                <option value="jungle">Jungle</option>
                <option value="parchment">Parchment</option>
              </select>
            </div>
            <hr />
            <div className="flex gap-4 justify-between">
              <span>Font</span>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value as Font)}
                className="text-center cursor-pointer w-full hover:bg-foreground/10 rounded-sm"
              >
                <option value="mono">Mono</option>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
              </select>
            </div>
          </div>
        </Dialog>
      )}
      {nodes.map((n, i) =>
        n.showing ? (
          <DraggableBox
            key={i}
            {...n}
            node={componentMap[n.nodeName]}
            onClick={() => bringToFront(i)}
            onMove={(x, y) => moveNode(i, x, y)}
            onChange={(updated: Partial<NodePropsMap[keyof NodePropsMap]>) =>
              updateNodeProps(i, updated)
            }
            onToggleShowing={() => toggleNodeShowing(i)}
          />
        ) : null,
      )}
      <TaskBar nodes={nodes} setNodes={setNodes} />
    </div>
  );
}
