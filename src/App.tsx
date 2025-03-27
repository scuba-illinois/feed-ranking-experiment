import { useState, createContext, useContext } from "react";
import { Phases, Survey } from "./types";
import { posts } from "./posts";
import { PostQuestionnaire } from "./PostQuestionnaire";
import { PostCard } from "./PostCard";

export const SurveyContext = createContext<{
	phase: Phases;
	setPhase: (phase: Phases) => void;
	participantUUID: string;
	setParticipantUUID: (participantUUID: string) => void;
	debug: boolean;
	setDebug: (debug: boolean) => void;
	selectedPost: string;
	setSelectedPost: (selectedPost: string) => void;
	completedPosts: string[];
	setCompletedPosts: (completedPosts: string[]) => void;
	survey: Survey;
	setSurvey: (survey: Survey) => void;
	postPosition: number;
	setPostPosition: (postPosition: number) => void;
}>({
	phase: "intro",
	setPhase: () => {},
	participantUUID: "",
	setParticipantUUID: () => {},
	debug: false,
	setDebug: () => {},
	selectedPost: "",
	setSelectedPost: () => {},
	completedPosts: [],
	setCompletedPosts: () => {},
	survey: {
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	},
	setSurvey: () => {},
	postPosition: 0,
	setPostPosition: () => {},
});

function FeedPhase() {
	const { debug, selectedPost, completedPosts, survey, setDebug } =
		useContext(SurveyContext);

	return (
		<>
			{" "}
			{debug && (
				<div className="p-4 text-[8pt]">
					<p>Completed Posts: {completedPosts.length}</p>
					<p>Selected Post: {selectedPost}</p>
					<pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
						{JSON.stringify(survey, null, 2)}
					</pre>
				</div>
			)}
			<div className="m-3">
				<h1 className="font-bold text-2xl">Trending on Reddit</h1>
				<p className="text-[10pt]">
					To start assessing posts, please click on any post.
				</p>
				<button
					className={`py-2 px-3 rounded-md text-[8pt] transition-colors mt-2 ${
						debug
							? "bg-red-500 text-white hover:bg-red-600"
							: "bg-blue-500 text-white hover:bg-blue-600"
					}`}
					onClick={() => setDebug(!debug)}
				>
					{debug ? "Disable Debug" : "Enable Debug"}
				</button>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					{posts.map((post, index) => (
						<PostCard key={index} post={post} position={index + 1} />
					))}
				</div>
				{selectedPost && !completedPosts.includes(selectedPost) ? (
					<div className="w-1/2 sticky top-2 self-start flex flex-col gap-1 outline-2 outline-blue-500 rounded-md p-4 text-[8pt]">
						<PostQuestionnaire postUUID={selectedPost} />
					</div>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</>
	);
}

function IntroPhase() {
	const { setParticipantUUID, setPhase } = useContext(SurveyContext);
	const [participantID, setParticipantID] = useState("");

	return (
		<div className="flex items-center justify-center h-screen text-[10pt]">
			<div className="flex flex-col gap-4 w-full max-w-sm">
				<h2 className="text-[12pt] font-bold">Welcome!</h2>
				<p className="text-gray-600">
					If you are here to participate in a study, please enter your
					participant ID below.
				</p>
				<form
					className="flex flex-col gap-2"
					onSubmit={(e) => {
						e.preventDefault();

						// TODO: Validate the participant ID before setting it.

						setParticipantUUID(participantID);

						setPhase("instructions");
					}}
				>
					<input
						type="text"
						placeholder="Enter Participant ID"
						className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={participantID}
						onChange={(e) => setParticipantID(e.target.value)}
					/>
					<button
						type="submit"
						className={`px-4 py-2 rounded-md transition-colors ${
							participantID
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
						disabled={!participantID}
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

function App() {
	const [phase, setPhase] = useState<Phases>("intro");
	const [participantUUID, setParticipantUUID] = useState("");
	const [selectedPost, setSelectedPost] = useState("");
	const [postPosition, setPostPosition] = useState(0);
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);
	const [survey, setSurvey] = useState<Survey>({
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	});
	const [debug, setDebug] = useState(false);

	return (
		<SurveyContext.Provider
			value={{
				phase: phase,
				setPhase: setPhase,
				participantUUID: participantUUID,
				setParticipantUUID: setParticipantUUID,
				debug: debug,
				setDebug: setDebug,
				selectedPost,
				setSelectedPost,
				completedPosts,
				setCompletedPosts,
				survey,
				setSurvey,
				postPosition,
				setPostPosition,
			}}
		>
			{phase === "intro" && <IntroPhase />}
		</SurveyContext.Provider>
	);
}

export default App;
