'use client'

import DraggableBox from './nodes'
import TaskBar from './taskbar'
import { useState, useEffect } from 'react'
import { componentMap, NodeEntry } from './componentMap'

const DEFAULT_NODES = [
	{
		nodeName: 'Clock',
		props: { showSeconds: true, use24Hour: false, border: true, background: true },
		x: 100, y: 100, z: 1, showing: true,
	},
	{
		nodeName: 'Calendar',
		props: { border: true, background: true },
		x: 400, y: 400, z: 2, showing: false,
	},
] as NodeEntry[];

export default function Home() {
	const [nodes, setNodes] = useState<NodeEntry[]>([]);

	useEffect(() => {

		const saved = localStorage.getItem('nodes');

		let loadedNodes = DEFAULT_NODES.map(defaultNode => ({ ...defaultNode }));

		if (saved) {
			try {
				const parsed: NodeEntry[] | null = JSON.parse(saved);

				if (parsed) {
					loadedNodes = DEFAULT_NODES.map(defaultNode => {
						const savedNode = parsed.find(n => n.nodeName === defaultNode.nodeName);

						if (savedNode) {
							return {
								...defaultNode,
								...savedNode,
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
				console.error('Failed to parse saved nodes:', error);
			}
		}

		setNodes(loadedNodes.map((n, i) => ({
			...n,
			onChange: (newProps: any) => {
				setNodes(prev =>
					prev.map((p, j) =>
						i === j ? { ...p, props: { ...p.props, ...newProps } } : p
					)
				);
			},
		})) as NodeEntry[]);
	}, []);

	useEffect(() => {
		if (nodes.length) {
			const clean = nodes.map(({ onChange, ...rest }) => rest);
			localStorage.setItem('nodes', JSON.stringify(clean));
		}
	}, [nodes]);

	const [highestZ, setHighestZ] = useState(10);

	const bringToFront = (index: number) => {
		setNodes(prev =>
			prev.map((w, i) =>
				i === index ? { ...w, z: highestZ + 1 } : w
			)
		);
		setHighestZ(z => z + 1);
		console.log(highestZ);
	};

	const moveNode = (index: number, x: number, y: number) => {
		setNodes(prev =>
			prev.map((n, i) =>
				i === index ? { ...n, x, y } : n
			)
		);
	};

	const toggleNodeShowing = (index: number) => {
		setNodes(prev =>
			prev.map((n, i) =>
				i === index ? { ...n, showing: !n.showing } : n
			)
		);
	};

	return (
		<div className='relative min-h-screen overflow-hidden bg-[#282828]'>
			{nodes.map((n, i) =>
				n.showing ? (
					<DraggableBox
						key={i}
						{...n}
						node={componentMap[n.nodeName]}
						onClick={() => bringToFront(i)}
						onMove={(x, y) => moveNode(i, x, y)}
						onToggleShowing={() => toggleNodeShowing(i)}
					/>
				) : null
			)}
			<TaskBar nodes={nodes} setNodes={setNodes} />
		</div>
	);
}
