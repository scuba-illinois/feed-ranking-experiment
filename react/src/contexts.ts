import { createContext } from "react";

export const SurveyContext = createContext<{
	data: object;
	setData: (data: object) => void;

	phase: string;
	setPhase: (phase: string) => void;

	participantID: string | null;
	setParticipantID: (id: string | null) => void;

	consentTimestamp: string | null;
	setConsentTimestamp: (timestamp: string | null) => void;
}>({
	data: {},
	setData: () => {},

	phase: "start",
	setPhase: () => {},

	participantID: null,
	setParticipantID: () => {},

	consentTimestamp: null,
	setConsentTimestamp: () => {},
});
