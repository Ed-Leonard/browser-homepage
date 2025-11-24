'use client'

import DraggableBox from './nodes'
import { Clock, AnyProps } from './nodes'
import TaskBar from './taskbar'
import { useState } from 'react'

export type NodeEntry<P extends AnyProps = AnyProps> = {
	node: React.ComponentType<P>;
	className: string;
	props: P;
	z: number;
	showing: boolean;
	onChange?: (newProps: Partial<P>) => void;
};

export default function Home() {
	const [nodes, setNodes] = useState<NodeEntry<any>[]>([
		{ node: Clock, className: 'top-10 left-10', props: { showSeconds: true, use24Hour: false, border: true, background: true }, z: 1, showing: true },
	]);

	const [highestZ, setHighestZ] = useState(10);

	const updateNodeProps = (index: number, newProps: any) => {
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

	return (
		<div className='relative min-h-screen overflow-hidden bg-[#282828]'>
			{nodes.map((nodeEntry, i) => (
				(nodeEntry.showing ? <DraggableBox
					key={i}
					{...nodeEntry}
					onClick={() => bringToFront(i)}
					onChange={newProps => updateNodeProps(i, newProps)}
				/> : null)
			))}
			<TaskBar nodes={nodes} setNodes={setNodes} />
		</div>
	);
}
