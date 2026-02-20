import { Clock, Calendar, Leet } from './nodes';

export type NodePropsMap = {
	Clock: {
		showSeconds: boolean;
		use24Hour: boolean;
		border: boolean;
		background: boolean;
	};
	Calendar: {
		border: boolean;
		background: boolean;
	}
	Leet: {
		border: boolean;
		background: boolean;
	}
};

export const componentMap: {
	[K in keyof NodePropsMap]: React.ComponentType<NodePropsMap[K]>
} = {
	Clock,
	Calendar,
	Leet,
};

export type NodeEntry = {
	[K in keyof NodePropsMap]: {
		nodeName: K;
		props: NodePropsMap[K];
		x: number;
		y: number;
		z: number;
		showing: boolean;
		onChange?: (newProps: Partial<NodePropsMap[K]>) => void;
	}
}[keyof NodePropsMap];
