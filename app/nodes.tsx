'use client';

import Draggable from 'react-draggable';
import { useRef } from 'react';

export default function DraggableBox({ className }: { className?: string }) {
	const nodeRef = useRef(null);

	return (
		<Draggable nodeRef={nodeRef} handle='.header' bounds='parent'>
			<div ref={nodeRef} className={`window group relative ${className}`}>
				<div className='header opacity-0 group-hover:opacity-100 transition-opacity flex justify-end' style={{ cursor: 'move' }}>
					<button >x</button>
				</div>
				<div>
					content
				</div>
			</div>
		</Draggable>
	);
}
