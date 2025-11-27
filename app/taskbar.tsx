import { NodeEntry } from "./componentMap";

export default function TaskBar({ nodes, setNodes }: { nodes: NodeEntry[], setNodes: React.Dispatch<React.SetStateAction<NodeEntry[]>> }) {

	const onClick = (nodeType: React.ComponentType<any>) => {
		setNodes(prev =>
			prev.map(n =>
				n.node === nodeType
					? { ...n, showing: !n.showing }
					: n
			)
		);
	}

	return (
		<div className='absolute group bottom-0 w-full'>
			<div className='p-4 transform transition-all duration-300 translate-y-1/1 group-hover:translate-y-0 flex flex-row justify-center space-x-4 h-20'>
				{nodes.map((entry, index) =>
					<button key={index} className='cursor-pointer' onClick={() => onClick(entry.node)}>clock</button>
				)}
			</div>
		</div>
	)
}
