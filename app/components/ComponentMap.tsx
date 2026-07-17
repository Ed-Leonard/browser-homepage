import {
  Clock,
  Leet,
  GoogleSearch,
  Weather,
  Shortcuts,
  HN,
  WordOfTheDay,
  Sketchpad,
  Notepad,
} from "./Nodes";

export type NodePropsMap = {
  Clock: {
    showSeconds: boolean;
    use24Hour: boolean;
    border: boolean;
    background: boolean;
    fontSize: string;
    shadow: string;
  };
  Leet: {
    background: boolean;
    border: boolean;
    shadow: string;
  };
  Weather: {
    border: boolean;
    background: boolean;
    celsius: boolean;
    fontSize: string;
    shadow: string;
  };
  GoogleSearch: {
    border: boolean;
    background: boolean;
    fontSize: string;
    shadow: string;
  };
  Shortcuts: {
    border: boolean;
    background: boolean;
    shadow: string;
  };
  HN: {
    border: boolean;
    background: boolean;
    shadow: string;
  };
  WordOfTheDay: {
    border: boolean;
    background: boolean;
    shadow: string;
  };
  Sketchpad: {
    border: boolean;
    background: boolean;
    shadow: string;
  };
  Notepad: {
    border: boolean;
    background: boolean;
    shadow: string;
  };
};

export const componentMap: {
  [K in keyof NodePropsMap]: React.ComponentType<NodePropsMap[K]>;
} = {
  Clock,
  Leet,
  Weather,
  GoogleSearch,
  Shortcuts,
  HN,
  WordOfTheDay,
  Sketchpad,
  Notepad,
};

export type NodeEntry = {
  [K in keyof NodePropsMap]: {
    nodeName: K;
    icon?: React.ReactNode;
    props: NodePropsMap[K];
    x: number;
    y: number;
    z: number;
    showing: boolean;
    onChange?: (newProps: Partial<NodePropsMap[K]>) => void;
  };
}[keyof NodePropsMap];
