import { createContext } from "react";
import {
	Answers,
	ExitAnswers,
	OptionOrder,
	Phase,
	ScreenerAnswers,
	Settings,
} from "./types";

export const SurveyContext = createContext<{
	phase: Phase;
	setPhase: React.Dispatch<React.SetStateAction<Phase>>;

	prolific: {
		PROLIFIC_PID: string;
		STUDY_ID: string;
		SESSION_ID: string;
	};
	setProlific: React.Dispatch<
		React.SetStateAction<{
			PROLIFIC_PID: string;
			STUDY_ID: string;
			SESSION_ID: string;
		}>
	>;

	consentTimestamp: string;
	setConsentTimestamp: React.Dispatch<React.SetStateAction<string>>;

	feeds: string[];
	setFeeds: React.Dispatch<React.SetStateAction<string[]>>;

	feedURLs: string[];
	setFeedURLs: React.Dispatch<React.SetStateAction<string[]>>;

	feedData: Record<string, { uuid: string; y: number; height: number }[]>;
	setFeedData: React.Dispatch<
		React.SetStateAction<
			Record<string, { uuid: string; y: number; height: number }[]>
		>
	>;

	postURLs: Record<string, Record<string, string>>;
	setPostURLs: React.Dispatch<
		React.SetStateAction<Record<string, Record<string, string>>>
	>;

	optionOrder: OptionOrder;
	setOptionOrder: React.Dispatch<React.SetStateAction<OptionOrder>>;

	completedFeeds: string[];
	setCompletedFeeds: React.Dispatch<React.SetStateAction<string[]>>;

	screenerAnswers: ScreenerAnswers;
	setScreenerAnswers: React.Dispatch<React.SetStateAction<ScreenerAnswers>>;

	screenerStart: string;
	setScreenerStart: React.Dispatch<React.SetStateAction<string>>;

	screenerEnd: string;
	setScreenerEnd: React.Dispatch<React.SetStateAction<string>>;

	screenerDuration: number;
	setScreenerDuration: React.Dispatch<React.SetStateAction<number>>;

	exitAnswers: ExitAnswers;
	setExitAnswers: React.Dispatch<React.SetStateAction<ExitAnswers>>;

	exitStart: string;
	setExitStart: React.Dispatch<React.SetStateAction<string>>;

	exitEnd: string;
	setExitEnd: React.Dispatch<React.SetStateAction<string>>;

	exitDuration: number;
	setExitDuration: React.Dispatch<React.SetStateAction<number>>;

	totalDuration: number;
	setTotalDuration: React.Dispatch<React.SetStateAction<number>>;

	answers: Answers;
	setAnswers: React.Dispatch<React.SetStateAction<Answers>>;

	submitted: "UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR";
	setSubmitted: React.Dispatch<
		React.SetStateAction<"UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR">
	>;

	compensation: {
		completionCode: string;
		completionURL: string;
	};
	setCompensation: React.Dispatch<
		React.SetStateAction<{
			completionCode: string;
			completionURL: string;
		}>
	>;

	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
	phase: "CONSENT",
	setPhase: () => {},

	prolific: {
		PROLIFIC_PID: "",
		STUDY_ID: "",
		SESSION_ID: "",
	},
	setProlific: () => {},

	optionOrder: {
		likert: [],
		selection_multiple_choice: [],
		selected_multiple_choice: [],
		non_selected_multiple_choice: [],
	},
	setOptionOrder: () => {},

	consentTimestamp: "",
	setConsentTimestamp: () => {},

	feeds: [],
	setFeeds: () => {},

	feedURLs: [],
	setFeedURLs: () => {},

	postURLs: {},
	setPostURLs: () => {},

	feedData: {},
	setFeedData: () => {},

	completedFeeds: [],
	setCompletedFeeds: () => {},

	screenerAnswers: {
		subreddits: [],
		interests: [],
	},
	setScreenerAnswers: () => {},

	screenerStart: "",
	setScreenerStart: () => {},

	screenerEnd: "",
	setScreenerEnd: () => {},

	screenerDuration: -1,
	setScreenerDuration: () => {},

	exitAnswers: {
		selectionExplained: [],
		selectedPostExplained: [],
		nonSelectedPostExplained: [],
		attentionCheck: -1,
		age: "",
		gender: "",
		education: "",
		postLikelihood: -1,
		feedback: "",
		selectedPostExample: {
			feedUUID: "",
			postUUID: "",
		},
		nonSelectedPostExample: {
			feedUUID: "",
			postUUID: "",
		},
	},
	setExitAnswers: () => {},

	exitStart: "",
	setExitStart: () => {},

	exitEnd: "",
	setExitEnd: () => {},

	exitDuration: -1,
	setExitDuration: () => {},

	totalDuration: -1,
	setTotalDuration: () => {},

	answers: {},
	setAnswers: () => {},

	submitted: "UNSUBMITTED",
	setSubmitted: () => {},

	settings: {
		hideSelectionDirections: false,
		hideRatingDirections: false,
	},
	setSettings: () => {},

	compensation: {
		completionCode: "",
		completionURL: "",
	},
	setCompensation: () => {},
});
