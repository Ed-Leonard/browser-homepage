import { AnyProps, Clock } from './nodes';

export type NodePropsMap = {
	Clock: {
		showSeconds: boolean;
		use24Hour: boolean;
		border: boolean;
		background: boolean;
	};
};

export const componentMap: {
	[K in keyof NodePropsMap]: React.ComponentType<NodePropsMap[K]>
} = {
	Clock,
};

export type NodeEntry = {
	[K in keyof NodePropsMap]: {
		nodeName: K;
		node: React.ComponentType<NodePropsMap[K]>;
		props: NodePropsMap[K];
		z: number;
		showing: boolean;
		x: number;
		y: number;
		onChange?: (newProps: Partial<NodePropsMap[K]>) => void;
	}
}[keyof NodePropsMap];
