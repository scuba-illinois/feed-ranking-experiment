import { useState, useEffect } from "react";
import { SurveyContext } from "./contexts";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import { Phase, Answers } from "./types";
import { Screeners } from "./pages/Screeners";
import { ExitQuestionnaire } from "./pages/ExitQuestionnaire";
import { FeedSelect } from "./pages/FeedSelect";
import { FeedRate } from "./pages/FeedRate";

const getRandomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function App() {
	const [phase, setPhase] = useState<Phase>("CONSENT");
	const [participantID, setParticipantID] = useState<string | null>(null);
	const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
	const [feeds, setFeeds] = useState<string[]>([
		"5c18c574-32db-4028-b4ea-40e949ff81ba", // 2025-06-17 T19:03:35.472Z
		// "36a937d7-4fc4-4cbf-8705-83776c112078", // 2025-06-17 T20:53:48.130Z
		"20e1d2ef-2268-4d4b-a724-5f5d61cfc896", // 2025-06-19 T18:29:15.631Z
		"b28ae34e-0e6c-4a69-be52-75de4144e426", // 2025-06-18 T02:35:01.235Z
	]);
	const [completedFeeds, setCompletedFeeds] = useState<string[]>([]);
	const [rotations, setRotations] = useState<number[]>([
		getRandomInt(0, 9),
		getRandomInt(0, 9),
		getRandomInt(0, 9),
	]);
	const [answers, setAnswers] = useState<Answers>({});
	const [screenerAnswers, setScreenerAnswers] = useState<Record<string, any>>(
		{}
	);
	const [screenerTimestamp, setScreenerTimestamp] = useState<string | null>(
		null
	);
	const [exitAnswers, setExitAnswers] = useState<Record<string, any>>({});
	const [exitTimestamp, setExitTimestamp] = useState<string | null>(null);

	// Ideally for later. Maybe do this after they submitted their participant ID.
	useEffect(() => {
		setAnswers((state) => ({ ...state }));
	}, []);

	return (
		<SurveyContext.Provider
			value={{
				phase,
				setPhase,
				participantID,
				setParticipantID,
				consentTimestamp,
				setConsentTimestamp,
				feeds,
				setFeeds,
				completedFeeds,
				setCompletedFeeds,
				rotations,
				setRotations,
				answers,
				setAnswers,
				screenerAnswers,
				setScreenerAnswers,
				screenerTimestamp,
				setScreenerTimestamp,
				exitAnswers,
				setExitAnswers,
				exitTimestamp,
				setExitTimestamp,
			}}
		>
			{phase === "CONSENT" && <Intro />}
			{phase === "SCREENER" && <Screeners />}
			{phase === "FEED" && <FeedSelect />}
			{phase === "FEEDRATING" && <FeedRate />}
			{phase === "EXIT" && <ExitQuestionnaire />}
			{phase === "GOODBYE" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
