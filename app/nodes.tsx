'use client';

import Draggable from 'react-draggable';
import { NodeEntry } from './componentMap';
import { useRef, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

export type AnyProps = {
	border?: boolean;
	background?: boolean;
	[key: string]: any;
};

export function Clock({ showSeconds = true, use24Hour = false, border = false, background = false }: AnyProps) {
	const [time, setTime] = useState("");

	useEffect(() => {
		const update = () => {
			const now = new Date();

			let hours = now.getHours();
			const minutes = now.getMinutes();
			const seconds = now.getSeconds();

			let suffix = "";

			if (!use24Hour) {
				suffix = hours >= 12 ? " PM" : " AM";
				hours = hours % 12 || 12;
			}

			const hh = hours.toString().padStart(2, "0");
			const mm = minutes.toString().padStart(2, "0");
			const ss = seconds.toString().padStart(2, "0");

			const formatted =
				showSeconds ? `${hh}:${mm}:${ss}${suffix}` : `${hh}:${mm}${suffix}`;

			setTime(formatted);
		};

		update();
		const interval = setInterval(update, 1000);

		return () => clearInterval(interval);
	}, [showSeconds, use24Hour]);

	return (
		<div className={`text-6xl noselect p-2 rounded-lg ${border ? 'border' : 'border-0'} ${background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			{time}
		</div >
	);
}

export default function DraggableBox<P extends AnyProps>({ nodeName, node, props, onChange, onClick, x, y, z, setNodes }: NodeEntry<P> & { onClick: () => void, setNodes: React.Dispatch<React.SetStateAction<NodeEntry[]>> }) {
	const nodeRef = useRef(null);
	const Node = node;
	const [showSettings, setShowSettings] = useState(false);

	const toggleFields: Record<string, string> = {
		showSeconds: "Show Seconds",
		use24Hour: "24 Hour",
		border: "Border",
		background: "Background",
	};

	const onClose = (nodeType: Partial<AnyProps>) => {
		setNodes(prev =>
			prev.map(n =>
				n.node === nodeType ? { ...n, showing: !n.showing } : n)
		);
	}

	return (
		<>
			<Draggable nodeRef={nodeRef} handle='.header' bounds='parent' onMouseDown={onClick} position={{ x, y }}
				onStop={(_, data) => {
					setNodes(prev =>
						prev.map(n =>
							n.nodeName === nodeName
								? { ...n, x: data.x, y: data.y }
								: n
						)
					);
				}}>
				<div
					ref={nodeRef}
					className={`window group absolute`}
					style={{ zIndex: z }} >
					<div
						className='header opacity-0 pb-1 px-1 group-hover:opacity-100 transition-opacity flex justify-between cursor-move'
					>
						<button onClick={() => setShowSettings(!showSettings)} className='cursor-pointer' >settings</button>
						<button className='cursor-pointer' onClick={() => onClose(node)}>x</button>
					</div>
					<Node {...props} />
				</div>
			</Draggable>

			<Dialog
				open={showSettings}
				onClose={() => setShowSettings(false)}
				BackdropProps={{
					sx: {
						backgroundColor: "transparent",
					},
				}}
				PaperProps={{
					sx: {
						backgroundColor: "transparent",
						boxShadow: "none",
						p: 0,
						overflow: "visible",
					},
				}}
			>
				<Draggable nodeRef={nodeRef}>
					<div className='bg-[#1d2021] p-4 text-[#ebdbb2] rounded-lg border cursor-move'>
						{Object.entries(toggleFields).map(([key, label]) =>
							key in props ? (
								<label
									key={key}
									className="flex justify-between items-center w-full cursor-pointer p-2 border-b rounded-bl-lg hover:bg-[#282828]"
								>
									<input
										type="checkbox"
										checked={props[key]}
										onChange={(e) =>
											onChange?.({ [key]: e.target.checked } as Partial<P>)
										}
										className="cursor-pointer mr-32 bg-[#282828] border rounded-full size-2 appearance-none checked:bg-[#ebdbb2] checked: transition-all duration-75"
									/>
									<span className="text-lg noselect">{label}</span>
								</label>
							) : null
						)}
					</div>
				</Draggable>
			</Dialog>
		</>
	);
}
