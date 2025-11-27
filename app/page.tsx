'use client'

import DraggableBox from './nodes'
import { AnyProps, Clock } from './nodes'
import TaskBar from './taskbar'
import { useState } from 'react'
import { componentMap, NodeEntry } from './componentMap'

export default function Home() {
	const [nodes, setNodes] = useState<NodeEntry[]>([
		{
			nodeName: 'Clock',
			node: Clock,
			props: { showSeconds: true, use24Hour: false, border: true, background: true },
			x: 100,
			y: 100,
			z: 1,
			showing: true,
		},
	]);

	const [highestZ, setHighestZ] = useState(10);

	const updateNodeProps = (index: number, newProps: Partial<AnyProps>) => {
		setNodes(prev =>
			prev.map((n, i) =>
				i === index ? { ...n, props: { ...n.props, ...newProps } } : n
			)
		);
	};

	const bringToFront = (index: number) => {
		setNodes(prev =>
			prev.map((w, i) =>
				i === index ? { ...w, z: highestZ + 1 } : w
			)
		);
		setHighestZ(z => z + 1);
		console.log(highestZ);
	};

	const resolvedNodes = nodes.map(n => ({
		...n,
		node: componentMap[n.nodeName],
	}));

	return (
		<div className='relative min-h-screen overflow-hidden bg-[#282828]'>
			{resolvedNodes.map((nodeEntry, i) =>
				nodeEntry.showing ? (
					<DraggableBox
						key={i}
						{...nodeEntry}
						onClick={() => bringToFront(i)}
						onChange={newProps => updateNodeProps(i, newProps)}
						setNodes={setNodes}
					/>
				) : null
			)}
			<TaskBar nodes={nodes} setNodes={setNodes} />
		</div>
	);
}
