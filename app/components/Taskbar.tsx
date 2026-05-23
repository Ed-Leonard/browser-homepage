import { NodeEntry } from "./ComponentMap";

export default function TaskBar({
  nodes,
  setNodes,
}: {
  nodes: NodeEntry[];
  setNodes: React.Dispatch<React.SetStateAction<NodeEntry[]>>;
}) {
  const onClick = (nodeName: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.nodeName === nodeName ? { ...n, showing: !n.showing } : n,
      ),
    );
  };

  return (
    <div className="absolute group bottom-0 w-full">
      <div className="p-4 transform transition-all translate-y-1/1 group-hover:translate-y-0 flex flex-row justify-center space-x-8 h-20">
        {nodes.map((entry, index) => (
          <button
            key={index}
            className="cursor-pointer text-2xl active:scale-120 active:-translate-y-2 transition-all"
            onClick={() => onClick(entry.nodeName)}
          >
            {entry.icon ?? entry.nodeName}
          </button>
        ))}
      </div>
    </div>
  );
}
