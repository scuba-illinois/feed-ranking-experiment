import { createContext } from "react";
import { Answers, Phase } from "./types";

export const SurveyContext = createContext<{
	phase: Phase;
	setPhase: React.Dispatch<React.SetStateAction<Phase>>;

	participantID: string | null;
	setParticipantID: React.Dispatch<React.SetStateAction<string | null>>;

	consentTimestamp: string | null;
	setConsentTimestamp: React.Dispatch<React.SetStateAction<string | null>>;

	feeds: string[];
	setFeeds: React.Dispatch<React.SetStateAction<string[]>>;

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

	// TODO: Add a completion timestamp.
}>({
	phase: "CONSENT",
	setPhase: () => {},

	participantID: null,
	setParticipantID: () => {},

	consentTimestamp: null,
	setConsentTimestamp: () => {},

	feeds: [],
	setFeeds: () => {},

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
});
