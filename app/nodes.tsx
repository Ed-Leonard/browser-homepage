'use client';

import Draggable from 'react-draggable';
import { NodeEntry } from './page';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from "react-dom";

export type AnyProps = Record<string, any>;

export function Clock({ showSeconds = true, use24Hour = false, className = 'bg-[#3c3836] rounded-lg border' }: AnyProps) {
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
		<div className={`text-6xl noselect p-2 ${className}`} >
			{time}
		</div >
	);
}

export default function DraggableBox<P extends AnyProps>({ className, node, props, onChange, onClick, z }: NodeEntry<P> & { onClick: () => void }) {
	const nodeRef = useRef(null);
	const Node = node;
	const [showSettings, setShowSettings] = useState(false);

	return (
		<>
			<Draggable nodeRef={nodeRef} handle='.header' bounds='parent' onMouseDown={onClick}>
				<div
					ref={nodeRef}
					className={`window group absolute  ${className}`}
					style={{ zIndex: z }} >
					<div
						className='header opacity-0 pb-1 px-1 group-hover:opacity-100 transition-opacity flex justify-between'
						style={{ cursor: 'move' }} >
						<button onClick={() => setShowSettings(!showSettings)} style={{ cursor: 'pointer' }}>settings</button>
						<button style={{ cursor: 'pointer' }}>x</button>
					</div>
					<Node {...props} className={'bg-[#3c3836] rounded-lg border'} />
				</div>
			</Draggable>

			{showSettings && createPortal(
				<div
					className='settings absolute top-1/2 left-1/2 p-4 bg-[#1d2021] rounded-lg shadow-lg z-500 text-center flex-col'
					style={{ transform: 'translate(-50%, -50%)' }}
					onMouseDown={e => e.stopPropagation()} // prevent click-through
				>
					{'showSeconds' in props && (
						<label className='block' style={{ cursor: 'pointer' }} >
							<input
								type='checkbox'
								checked={props.showSeconds}
								onChange={e =>
									onChange?.({ showSeconds: e.target.checked } as any as Partial<P>)
								}
								style={{ cursor: 'pointer' }}
							/>
							Show Seconds
						</label>
					)}
					{'use24Hour' in props && (
						<label className='block' style={{ cursor: 'pointer' }}>
							<input
								type='checkbox'
								checked={props?.use24Hour}
								onChange={e =>
									onChange?.({ use24Hour: e.target.checked } as any as Partial<P>)
								}
								style={{ cursor: 'pointer' }}
							/>
							24 Hour
						</label>
					)}
					<button className="mt-2 px-2 py-1 rounded " onClick={() => setShowSettings(false)} style={{ cursor: 'pointer' }}>Close</button>
				</div>,
				document.body
			)}
		</>
	);
}
