import DraggableBox from './nodes'
import TaskBar from './taskbar'

export default function Home() {

	const nodes = [{ node: DraggableBox, className: 'top-10 left-10' }, { node: DraggableBox, className: 'top-20 left-20' }];

	return (
		<div className='relative min-h-screen font-sans bg-[#282828]'>
			{nodes.map(({ node: Node, className }, i) => (
				<Node key={i} className={className} />
			))}
			<TaskBar />
		</div>
	);
}
