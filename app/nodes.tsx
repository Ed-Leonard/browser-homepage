'use client';

import Draggable from 'react-draggable';
import { NodeEntry, NodePropsMap } from './componentMap';
import { useRef, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import LeetDaily from './leet';
import CurrentWeather from './weather';
import { fontSize } from './page';

type DraggableBoxProps = NodeEntry & {
	node: React.ComponentType<any>;
	onClick: () => void;
	onMove: (x: number, y: number) => void;
	onToggleShowing: () => void;
};

export function Clock(props: NodePropsMap["Clock"]) {
	const [time, setTime] = useState("");

	console.log(props.fontSize)

	const convertToSize = (size: fontSize) => {
		switch (size) {
			case fontSize.sm: 'text-sm'
			case fontSize.md: 'text-md'
			case fontSize.lg: 'text-lg'
			case fontSize.xl: 'text-xl'
			case fontSize.doublexl: 'text-2xl'
			case fontSize.triplexl: 'text-3xl'
			case fontSize.quadruplexl: 'text-4xl'
			case fontSize.quintuplexl: 'text-5xl'
			case fontSize.sextuplexl: 'text-6xl'
		}
	};

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
		<div className={`${convertToSize(props.fontSize)} font-mono font-extralight noselect p-2 rounded-lg ${props.border ? 'border' : 'border-0'} ${props.background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			{time}
		</div >
	);
}

export function Calendar(props: NodePropsMap["Calendar"]) {
	return (
		<div className={`rounded-lg ${props.border ? 'border' : 'border-0'} ${props.background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			calendar
		</div >
	)
}

export function Leet(props: NodePropsMap["Leet"]) {
	return (
		<div className={`rounded-lg ${props.border ? 'border' : 'border-0'}`} >
			<LeetDaily />
		</div >
	)
}

export function Weather(props: NodePropsMap["Weather"]) {
	return (
		<div className={`rounded-lg ${props.border ? 'border' : 'border-0'} ${props.background ? 'bg-[#3c3836]' : 'bg-transparent'}`} >
			<CurrentWeather celsius={props.celsius} />
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

	type FieldDef =
		| { type: 'toggle'; label: string }
		| { type: 'enum'; label: string; options: (string | number)[] };

	const toggleFields: Record<string, FieldDef> = {
		showSeconds: { type: 'toggle', label: 'Show Seconds' },
		use24Hour: { type: 'toggle', label: '24 Hour' },
		border: { type: 'toggle', label: 'Border' },
		background: { type: 'toggle', label: 'Background' },
		celsius: { type: 'toggle', label: 'Celsius' },
		fontSize: { type: 'enum', label: 'Font Size', options: ['small', 'medium', 'large', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] },
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
						className='header opacity-0 pb-1 px-1 group-hover:opacity-100 transition-opacity flex justify-between cursor-pointer'
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
				slotProps={{
					backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } },
					paper: { sx: { boxShadow: 'none', overflow: 'visible', backgroundColor: 'transparent', p: 2 } }
				}}
			>
				<Draggable nodeRef={nodeRef}>
					<div className='bg-[#282828] p-4 text-[#ebdbb2] rounded-lg border cursor-move'>
						{Object.entries(toggleFields).map(([key, field]) =>
							key in props ? (
								<label key={key} className="flex justify-between items-center w-full cursor-pointer p-2 border-b rounded-bl-lg hover:bg-[#1d2021]">
									<span className="text-lg noselect">{field.label}</span>
									{field.type === 'toggle' ? (
										<input
											type="checkbox"
											checked={Boolean(props[key as keyof typeof props])}
											onChange={(e) => onChange?.({ [key]: e.target.checked } as Partial<typeof props>)}
											className="cursor-pointer bg-[#282828] border rounded-full size-2 appearance-none checked:bg-[#ebdbb2] transition-all duration-75"
										/>
									) : (
										<div className="flex items-center gap-2">
											<button onClick={() => {
												const current = props[key as keyof typeof props] as unknown as number;
												const idx = field.options.indexOf(current);
												if (idx > 0) onChange?.({ [key]: field.options[idx - 1] } as Partial<typeof props>);
											}}>-</button>
											<span>{props[key as keyof typeof props]}</span>
											<button onClick={() => {
												const current = props[key as keyof typeof props] as unknown as number;
												const idx = field.options.indexOf(current);
												if (idx < field.options.length - 1) onChange?.({ [key]: field.options[idx + 1] } as Partial<typeof props>);
											}}>+</button>
										</div>
									)}
								</label>
							) : null
						)}					</div>
				</Draggable>
			</Dialog>
		</>
	);
}
