import { createContext } from "react";
import { Answers, Phase } from "./types";

export const SurveyContext = createContext<{
	data: object;
	setData: React.Dispatch<React.SetStateAction<object>>;

	phase: Phase;
	setPhase: React.Dispatch<React.SetStateAction<Phase>>;

	participantID: string | null;
	setParticipantID: React.Dispatch<React.SetStateAction<string | null>>;

	consentTimestamp: string | null;
	setConsentTimestamp: React.Dispatch<React.SetStateAction<string | null>>;

	feeds: string[];
	setFeeds: React.Dispatch<React.SetStateAction<string[]>>;

	rotations: number[];
	setRotations: React.Dispatch<React.SetStateAction<number[]>>;

	answers: Answers;
	setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}>({
	data: {},
	setData: () => {},

	phase: "CONSENT",
	setPhase: () => {},

	participantID: null,
	setParticipantID: () => {},

	consentTimestamp: null,
	setConsentTimestamp: () => {},

	feeds: [],
	setFeeds: () => {},

	rotations: [],
	setRotations: () => {},

	answers: {},
	setAnswers: () => {},
});
