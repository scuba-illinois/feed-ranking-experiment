import { useState } from "react";
import { SurveyContext } from "./contexts";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import {
	Phase,
	Answers,
	ScreenerAnswers,
	ExitAnswers,
	OptionOrder,
} from "./types";
import { Screeners } from "./pages/Screeners";
import { ExitQuestionnaire } from "./pages/ExitQuestionnaire";
import { FeedSelect } from "./pages/FeedSelect";
import { FeedRate } from "./pages/FeedRate";
import { BrowserRouter } from "react-router-dom";

function App() {
	const [phase, setPhase] = useState<Phase>("CONSENT");

	const [prolific, setProlific] = useState<{
		PROLIFIC_PID: string;
		STUDY_ID: string;
		SESSION_ID: string;
	}>({ PROLIFIC_PID: "", STUDY_ID: "", SESSION_ID: "" });

	const [optionOrder, setOptionOrder] = useState<OptionOrder>({
		likert: [],
		selection_multiple_choice: [],
		selected_multiple_choice: [],
		non_selected_multiple_choice: [],
	});

	const [consentTimestamp, setConsentTimestamp] = useState<string>("");
	const [feeds, setFeeds] = useState<string[]>([]);
	const [completedFeeds, setCompletedFeeds] = useState<string[]>([]);
	const [feedURLs, setFeedURLs] = useState<string[]>([]);
	const [postURLs, setPostURLs] = useState<
		Record<string, Record<string, string>>
	>({});
	const [feedData, setFeedData] = useState<
		Record<string, { uuid: string; y: number; height: number }[]>
	>({});
	const [answers, setAnswers] = useState<Answers>({});

	const [screenerAnswers, setScreenerAnswers] = useState<ScreenerAnswers>({
		subreddits: [],
		interests: [],
	});
	const [screenerStart, setScreenerStart] = useState<string>("");
	const [screenerEnd, setScreenerEnd] = useState<string>("");
	const [screenerDuration, setScreenerDuration] = useState<number>(-1);

	const [exitAnswers, setExitAnswers] = useState<ExitAnswers>({
		selectionExplained: [],
		selectedPostExplained: [],
		nonSelectedPostExplained: [],
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
	});
	const [exitStart, setExitStart] = useState<string>("");
	const [exitEnd, setExitEnd] = useState<string>("");
	const [exitDuration, setExitDuration] = useState<number>(-1);

	const [totalDuration, setTotalDuration] = useState<number>(-1);

	const [submitted, setSubmitted] = useState<
		"UNSUBMITTED" | "PENDING" | "SUBMITTED" | "ERROR"
	>("UNSUBMITTED");

	const [settings, setSettings] = useState({
		hideSelectionDirections: false,
		hideRatingDirections: false,
	});

	const [compensation, setCompensation] = useState({
		completionCode: "",
		completionURL: "",
	});

	return (
		<SurveyContext.Provider
			value={{
				phase,
				setPhase,
				prolific,
				setProlific,
				optionOrder,
				setOptionOrder,
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
				answers,
				setAnswers,
				screenerAnswers,
				setScreenerAnswers,
				screenerStart,
				setScreenerStart,
				screenerEnd,
				setScreenerEnd,
				screenerDuration,
				setScreenerDuration,
				exitAnswers,
				setExitAnswers,
				exitStart,
				setExitStart,
				exitEnd,
				setExitEnd,
				exitDuration,
				setExitDuration,
				totalDuration,
				setTotalDuration,
				submitted,
				setSubmitted,
				settings,
				setSettings,
				compensation,
				setCompensation,
			}}
		>
			<BrowserRouter>
				{phase === "CONSENT" && <Intro />}
				{phase === "SCREENER" && <Screeners />}
				{phase === "FEED" && <FeedSelect />}
				{phase === "FEEDRATING" && <FeedRate />}
				{phase === "EXIT" && <ExitQuestionnaire />}
				{phase === "GOODBYE" && <Goodbye />}
			</BrowserRouter>
		</SurveyContext.Provider>
	);
}

export default App;
