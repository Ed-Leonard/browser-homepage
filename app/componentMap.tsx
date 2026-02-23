import { Clock, Calendar, Leet, Weather } from './nodes';
import { fontSize } from './page';

export type NodePropsMap = {
	Clock: {
		showSeconds: boolean;
		use24Hour: boolean;
		border: boolean;
		background: boolean;
		fontSize: fontSize;
	};
	Calendar: {
		border: boolean;
		background: boolean;
	}
	Leet: {
		border: boolean;
	}
	Weather: {
		border: boolean;
		background: boolean;
		celsius: boolean;
	}
};

export const componentMap: {
	[K in keyof NodePropsMap]: React.ComponentType<NodePropsMap[K]>
} = {
	Clock,
	Calendar,
	Leet,
	Weather,
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
