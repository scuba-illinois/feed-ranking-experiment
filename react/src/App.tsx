import { useState, useEffect } from "react";
import { SurveyContext } from "./contexts";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import { Phase, Answers } from "./types";
import { Screeners } from "./pages/Screeners";
import { ExitQuestionnaire } from "./pages/ExitQuestionnaire";
import { FeedSelect } from "./pages/FeedSelect";
import { FeedRate } from "./pages/FeedRate";

function App() {
	const [phase, setPhase] = useState<Phase>("CONSENT");
	const [participantID, setParticipantID] = useState<string | null>(null);
	const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
	const [feeds, setFeeds] = useState<string[]>([
		"5c18c574-32db-4028-b4ea-40e949ff81ba",
	]);
	const [completedFeeds, setCompletedFeeds] = useState<string[]>([]);
	const [rotations, setRotations] = useState<number[]>([7]);
	const [answers, setAnswers] = useState<Answers>({});

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
			}}
		>
			{phase === "CONSENT" && <Intro />}
			{phase === "SCREENERS" && <Screeners />}
			{phase === "FEED" && <FeedSelect />}
			{phase === "FEEDRATING" && <FeedRate />}
			{phase === "EXITQUESTIONNAIRE" && <ExitQuestionnaire />}
			{phase === "GOODBYE" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
