import { createContext } from "react";
import { Answers, Phase, Settings } from "./types";

export const SurveyContext = createContext<{
	phase: Phase;
	setPhase: React.Dispatch<React.SetStateAction<Phase>>;

	participantID: string | null;
	setParticipantID: React.Dispatch<React.SetStateAction<string | null>>;

	consentTimestamp: string | null;
	setConsentTimestamp: React.Dispatch<React.SetStateAction<string | null>>;

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

	completedFeeds: string[];
	setCompletedFeeds: React.Dispatch<React.SetStateAction<string[]>>;

	rotations: number[];
	setRotations: React.Dispatch<React.SetStateAction<number[]>>;

	screenerAnswers?: Record<string, any>;
	setScreenerAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;

	screenerStart: string;
	setScreenerStart: React.Dispatch<React.SetStateAction<string>>;

	screenerEnd: string;
	setScreenerEnd: React.Dispatch<React.SetStateAction<string>>;

	screenerDuration: number;
	setScreenerDuration: React.Dispatch<React.SetStateAction<number>>;

	exitAnswers?: Record<string, any>;
	setExitAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;

	exitStart: string;
	setExitStart: React.Dispatch<React.SetStateAction<string>>;

	exitEnd: string;
	setExitEnd: React.Dispatch<React.SetStateAction<string>>;

	exitDuration: number;
	setExitDuration: React.Dispatch<React.SetStateAction<number>>;

	answers: Answers;
	setAnswers: React.Dispatch<React.SetStateAction<Answers>>;

	submitted: "UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR";
	setSubmitted: React.Dispatch<
		React.SetStateAction<"UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR">
	>;

	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
	phase: "CONSENT",
	setPhase: () => {},

	participantID: null,
	setParticipantID: () => {},

	consentTimestamp: null,
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

	rotations: [],
	setRotations: () => {},

	screenerAnswers: {},
	setScreenerAnswers: () => {},

	screenerStart: "",
	setScreenerStart: () => {},

	screenerEnd: "",
	setScreenerEnd: () => {},

	screenerDuration: -1,
	setScreenerDuration: () => {},

	exitAnswers: {},
	setExitAnswers: () => {},

	exitStart: "",
	setExitStart: () => {},

	exitEnd: "",
	setExitEnd: () => {},

	exitDuration: -1,
	setExitDuration: () => {},

	answers: {},
	setAnswers: () => {},

	submitted: "UNSUBMITTED",
	setSubmitted: () => {},

	settings: {
		hideSelectionDirections: false,
		hideRatingDirections: false,
	},
	setSettings: () => {},
});
