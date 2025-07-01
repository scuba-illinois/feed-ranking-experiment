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
	const [feeds, setFeeds] = useState<string[]>([]);
	const [completedFeeds, setCompletedFeeds] = useState<string[]>([]);
	const [feedURLs, setFeedURLs] = useState<string[]>([]);
	const [postURLs, setPostURLs] = useState<
		Record<string, Record<string, string>>
	>({});
	const [feedData, setFeedData] = useState<
		Record<string, { uuid: string; y: number; height: number }[]>
	>({});
	const [rotations, setRotations] = useState<number[]>([]);
	const [answers, setAnswers] = useState<Answers>({});
	const [screenerAnswers, setScreenerAnswers] = useState<Record<string, any>>(
		{}
	);
	const [screenerTimestamp, setScreenerTimestamp] = useState<string | null>(
		null
	);
	const [exitAnswers, setExitAnswers] = useState<Record<string, any>>({});
	const [exitTimestamp, setExitTimestamp] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState<
		"UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR"
	>("UNSUBMITTED");
	const [settings, setSettings] = useState({
		hideSelectionDirections: false,
		hideRatingDirections: false,
	});

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
				feedURLs,
				setFeedURLs,
				feedData,
				setFeedData,
				postURLs,
				setPostURLs,
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
				submitted,
				setSubmitted,
				settings,
				setSettings,
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
