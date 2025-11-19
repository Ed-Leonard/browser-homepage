"use client";

import Draggable from "react-draggable";
import { useRef } from "react";

export default function DraggableBox() {
	const nodeRef = useRef(null);

	return (
		<Draggable nodeRef={nodeRef}>
			<div ref={nodeRef}>
				Drag me!
			</div>
		</Draggable>
	);
}
