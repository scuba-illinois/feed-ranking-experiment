import { useState, useEffect } from "react";
import { SurveyContext } from "./contexts";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import { Phase, Answers } from "./types";
import { Screeners } from "./pages/Screeners";
import { ExitQuestionnaire } from "./pages/ExitQuestionnaire";
import { FeedSelect } from "./pages/FeedSelect";
import { FeeedRate } from "./pages/FeedRate";

function App() {
	const [data, setData] = useState<object>({});
	const [phase, setPhase] = useState<Phase>("CONSENT");
	const [participantID, setParticipantID] = useState<string | null>(null);
	const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
	const [feeds, setFeeds] = useState<string[]>(["2025-04-01T19:30:19Z"]);
	const [rotations, setRotations] = useState<number[]>([1]);
	const [answers, setAnswers] = useState<Answers>({});

	// Ideally for later. Maybe do this after they submitted their participant ID.
	useEffect(() => {
		setAnswers((state) => ({ ...state }));
	}, []);

	return (
		<SurveyContext.Provider
			value={{
				data,
				setData,
				phase,
				setPhase,
				participantID,
				setParticipantID,
				consentTimestamp,
				setConsentTimestamp,
				feeds,
				setFeeds,
				rotations,
				setRotations,
				answers,
				setAnswers,
			}}
		>
			{phase === "CONSENT" && <Intro />}
			{phase === "SCREENERS" && <Screeners />}
			{phase === "FEED" && <FeedSelect />}
			{/* {phase === "FEEDRATING" && <FeedRate />} */}
			{/* TODO: Rename this later. */}
			{phase === "FEEDRATING" && <FeeedRate />}
			{phase === "EXITQUESTIONNAIRE" && <ExitQuestionnaire />}
			{phase === "GOODBYE" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
