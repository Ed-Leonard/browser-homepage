'use client'

import DraggableBox from './nodes'
import TaskBar from './taskbar'
import { useState, useEffect } from 'react'
import { componentMap, NodeEntry } from './componentMap'



export default function Home() {
	const [nodes, setNodes] = useState<NodeEntry[]>([]);

	useEffect(() => {
		const saved = localStorage.getItem('nodes');
		if (saved) {
			const parsed: NodeEntry[] = JSON.parse(saved);
			const withHandlers = parsed.map((n, i) => ({
				...n,
				onChange: (newProps: any) => {
					setNodes(prev =>
						prev.map((p, j) =>
							i === j ? { ...p, props: { ...p.props, ...newProps } } : p
						)
					);
				},
			}));
			setNodes(withHandlers);
		} else {
			setNodes([
				{
					nodeName: 'Clock',
					props: { showSeconds: true, use24Hour: false, border: true, background: true },
					x: 100, y: 100, z: 1, showing: true,
					onChange: (newProps) =>
						setNodes(prev =>
							prev.map(n =>
								n.nodeName === 'Clock'
									? { ...n, props: { ...n.props, ...newProps } }
									: n
							)
						),
				},
				{
					nodeName: 'Test',
					props: { border: true, background: true },
					x: 400, y: 400, z: 2, showing: false,
					onChange: (newProps) =>
						setNodes(prev =>
							prev.map(n =>
								n.nodeName === 'Clock'
									? { ...n, props: { ...n.props, ...newProps } }
									: n
							)
						),
				},
			]);
		}
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
