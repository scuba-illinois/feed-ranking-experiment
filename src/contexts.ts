import { createContext } from "react";
import { Phases, Survey } from "./types";

export const SurveyContext = createContext<{
	phase: Phases;
	setPhase: (phase: Phases) => void;
	debug: boolean;
	setDebug: (debug: boolean) => void;
	survey: Survey;
	setSurvey: (survey: Survey) => void;
}>({
	phase: "intro",
	setPhase: () => {},
	debug: false,
	setDebug: () => {},
	survey: {
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	},
	setSurvey: () => {},
});

export const PhaseContext = createContext<{
	selectedPostUUID: string;
	setSelectedPostUUID: (uuid: string) => void;
	completedPosts: string[];
	setCompletedPosts: (posts: string[]) => void;
}>({
	selectedPostUUID: "", // Default to an empty string
	setSelectedPostUUID: () => {}, // Default to an empty function
	completedPosts: [], // Default to an empty array
	setCompletedPosts: () => {}, // Default to an empty function
});
