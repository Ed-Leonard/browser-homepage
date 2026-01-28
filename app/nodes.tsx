'use client';

import Draggable from 'react-draggable';
import { NodeEntry, NodePropsMap } from './componentMap';
import { useRef, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

type DraggableBoxProps = NodeEntry & {
	node: React.ComponentType<any>;
	onClick: () => void;
	onMove: (x: number, y: number) => void;
	onToggleShowing: () => void;
};

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

			const formatted =
				props.showSeconds ? `${hh}:${mm}:${ss}${suffix}` : `${hh}:${mm}${suffix}`;

			setTime(formatted);
		};

		update();
		const interval = setInterval(update, 1000);

		return () => clearInterval(interval);
	}, [props.showSeconds, props.use24Hour]);

	return (
		<div className={`text-6xl noselect p-2 rounded-lg ${props.border ? 'border' : 'border-0'} ${props.background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			{time}
		</div >
	);
}

export function Calendar(props: NodePropsMap["Calendar"]) {
	return (
		<div className={`text-6xl noselect p-2 rounded-lg ${props.border ? 'border' : 'border-0'} ${props.background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			hello
		</div >
	)
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
	onToggleShowing
}: DraggableBoxProps) {
	const nodeRef = useRef(null);
	const [showSettings, setShowSettings] = useState(false);

	const toggleFields: Record<string, string> = {
		showSeconds: "Show Seconds",
		use24Hour: "24 Hour",
		border: "Border",
		background: "Background",
	};

	return (
		<>
			<Draggable
				nodeRef={nodeRef}
				handle='.header'
				bounds='parent'
				onMouseDown={onClick}
				position={{ x, y }}
				onStop={(_, data) => {
					onMove(data.x, data.y);
				}}>
				<div
					ref={nodeRef}
					className={`window group absolute`}
					style={{ zIndex: z }} >
					<div
						className='header opacity-0 pb-1 px-1 group-hover:opacity-100 transition-opacity flex justify-between cursor-move'
					>
						<button onClick={() => setShowSettings(!showSettings)} className='cursor-pointer' >settings</button>
						<button className='cursor-pointer' onClick={() => onToggleShowing()}>x</button>
					</div>
					<Node {...props} />
				</div>
			</Draggable>

			<Dialog
				open={showSettings}
				onClose={() => setShowSettings(false)}
				BackdropProps={{
					sx: {
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
					},
				}}
				PaperProps={{
					sx: {
						boxShadow: 'none',
						overflow: 'visible',
						backgroundColor: 'transparent',
						p: 2,
					},
				}}
			>
				<Draggable nodeRef={nodeRef}>
					<div className='bg-[#282828] p-4 text-[#ebdbb2] rounded-lg border cursor-move'>
						{Object.entries(toggleFields).map(([key, label]) =>
							key in props ? (
								<label
									key={key}
									className="flex justify-between items-center w-full cursor-pointer p-2 border-b rounded-bl-lg hover:bg-[#1d2021]"
								>
									<input
										type="checkbox"
										checked={Boolean(props[key as keyof typeof props])}
										onChange={(e) =>
											onChange?.({ [key]: e.target.checked } as Partial<typeof props>)
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
