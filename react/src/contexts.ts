import { createContext } from "react";

export const SurveyContext = createContext<{
	data: object;
	setData: (data: object) => void;
}>({
	data: {},
	setData: () => {},
});
