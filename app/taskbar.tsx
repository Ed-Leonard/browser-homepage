import { NodeEntry } from "./page";

export default function TaskBar({ nodes }: { nodes: NodeEntry[] }) {
	return (
		<div className='absolute group bottom-0 w-full'>
			<div className='h-8 z-20'></div>
			<div className='p-4 text-center transform transition-all duration-300 translate-y-1/1 group-hover:translate-y-0'>
				Taskbar content
			</div>
		</div>
	)
}
