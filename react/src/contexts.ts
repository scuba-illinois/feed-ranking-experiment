import { createContext } from "react";

export const SurveyContext = createContext<{
	data: object;
	setData: (data: object) => void;
	phase: string;
	setPhase: (phase: string) => void;
}>({
	data: {},
	setData: () => {},
	phase: "start",
	setPhase: () => {},
});
