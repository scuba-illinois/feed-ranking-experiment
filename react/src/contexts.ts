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

	screenerTimestamp: string | null;
	setScreenerTimestamp: React.Dispatch<React.SetStateAction<string | null>>;

	exitAnswers?: Record<string, any>;
	setExitAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;

	exitTimestamp: string | null;
	setExitTimestamp: React.Dispatch<React.SetStateAction<string | null>>;

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

	screenerTimestamp: null,
	setScreenerTimestamp: () => {},

	exitAnswers: {},
	setExitAnswers: () => {},

	exitTimestamp: null,
	setExitTimestamp: () => {},

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
