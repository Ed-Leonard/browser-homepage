'use client';

import Draggable from 'react-draggable';
import { NodeEntry } from './page';
import { useRef, useState, useEffect } from 'react';

export type AnyProps = Record<string, any>;

export function Clock({ showSeconds = true, use24Hour = false }: AnyProps) {
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
		<div className='text-6xl noselect p-2 bg-[#3c3836] rounded-lg border'>
			{time}
		</div>
	);
}

export default function DraggableBox<P extends AnyProps>({ className, node, props, onChange, onClick, z }: NodeEntry<P> & { onClick: () => void }) {
	const nodeRef = useRef(null)
	const Node = node
	const [showSettings, setShowSettings] = useState(false)

	return (
		<Draggable nodeRef={nodeRef} handle='.header' bounds='parent' cancel=".settings, input, button">
			<div ref={nodeRef} className={`window group absolute ${className}`}
				style={{ zIndex: z }}>
				<div className='header opacity-0 pb-1 px-1 group-hover:opacity-100 transition-opacity flex justify-between' style={{ cursor: 'move' }} onMouseDown={onClick}>
					<button onClick={() => setShowSettings(!showSettings)} >settings</button>
					<button>x</button>
				</div>
				<div onMouseDown={onClick}>
					<Node {...props} />
				</div>
				{showSettings && (
					<div className='settings p-2 text-white mt-2 rounded noselect'>
						{'showSeconds' in props && (
							<label>
								<input
									type='checkbox'
									checked={props.showSeconds}
									onChange={e =>
										onChange?.({ showSeconds: e.target.checked } as any as Partial<P>)
									}
									onMouseDown={e => e.stopPropagation()}
								/>
								Show Seconds
							</label>
						)}
						{'use24Hour' in props && (
							<label>
								<input
									type='checkbox'
									checked={props?.use24Hour}
									onChange={e =>
										onChange?.({ use24Hour: e.target.checked } as any as Partial<P>)
									}
									onMouseDown={e => e.stopPropagation()}
								/>
								24 Hour
							</label>
						)}
					</div>
				)}
			</div>
		</Draggable>
	);
}
