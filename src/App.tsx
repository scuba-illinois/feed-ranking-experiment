import { useState, useEffect, createContext, useContext } from "react";
import { Phases, Survey } from "./types";
import { posts } from "./posts";
import { PostQuestionnaire } from "./PostQuestionnaire";
import { PostCard } from "./PostCard";
import chance from "chance";

export const SurveyContext = createContext<{
	phase: Phases;
	setPhase: (phase: Phases) => void;
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
	const { debug, selectedPost, completedPosts, survey, setDebug, phase } =
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
						<PostQuestionnaire
							postUUID={selectedPost}
							phase={phase as "phase1" | "phase2" | "phase3"}
						/>
					</div>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</>
	);
}

function IntroPhase() {
	const { survey, setSurvey, setPhase } = useContext(SurveyContext);
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
						setSurvey({ ...survey, participant: participantID });

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

function InstructionsPhase() {
	const { setPhase } = useContext(SurveyContext);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-md text-[10pt]">
				<h2 className="text-[12pt] font-bold">Task Overview</h2>
				<p className="text-gray-700">
					You will be shown five social media posts from Reddit, all of which
					have previously appeared on Reddit's trending feed (r/popular). These
					posts will be presented one at a time and we want to understand how
					you would naturally engage with it if you came across it on a trending
					feed you browse.
				</p>
				<p className="text-gray-700">
					For the purposes of this experiment, do not open Reddit to view these
					posts.
				</p>
				<p className="text-gray-700">
					<span className="font-bold">Content Warning:</span> There is the
					potential that some social media posts included in this study may
					contain profanity or language that some participants may find
					offensive. While we do not intentionally select harmful content,
					trending posts reflect real user interactions and may include strong
					language. If you encounter any content that makes you uncomfortable,
					you are free to discontinue participation at any time.
				</p>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
					onClick={() => setPhase("phase1")}
				>
					Continue
				</button>
			</div>
		</div>
	);
}

function InstructionsPhase2() {
	const { setPhase } = useContext(SurveyContext);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-md text-[10pt]">
				<h2 className="text-[12pt] font-bold">Task Overview</h2>
				<p className="text-gray-700">
					During this phase, you will be shown two "snapshots" of Reddit's
					trending feed. As before, we want to understand how you would
					naturally engage with it if you came across it on a trending feed you
					browse.
				</p>
				<p className="text-gray-700">
					For the purposes of this experiment, do not open Reddit to view these
					posts.
				</p>
				<p className="text-gray-700">
					<span className="font-bold">Content Warning:</span> There is the
					potential that some social media posts included in this study may
					contain profanity or language that some participants may find
					offensive. While we do not intentionally select harmful content,
					trending posts reflect real user interactions and may include strong
					language. If you encounter any content that makes you uncomfortable,
					you are free to discontinue participation at any time.
				</p>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
					onClick={() => setPhase("phase2")}
				>
					Continue
				</button>
			</div>
		</div>
	);
}

function PostPhase() {
	const [selectedPosts] = useState<typeof posts>(
		new chance().shuffle(posts).slice(0, 2)
	);
	const [currentPost, setCurrentPost] = useState(1);
	const { selectedPost } = useContext(SurveyContext);

	return (
		<>
			<div className="m-3">
				<h1 className="font-bold text-2xl">
					Trending on Reddit (Post {currentPost} / 2)
				</h1>
				<p className="text-[10pt]">To start assessing the post, click on it.</p>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					<PostCard post={selectedPosts[currentPost - 1]} />
				</div>
				{selectedPost ? (
					<div className="w-1/2 sticky top-2 self-start flex flex-col gap-1 outline-2 outline-blue-500 rounded-md p-4 text-[8pt]">
						<PostQuestionnaire
							postUUID={selectedPosts[currentPost - 1].uuid}
							phase="phase1"
							currentPost={currentPost}
							setCurrentPost={setCurrentPost}
						/>
					</div>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</>
	);
}

function App() {
	const [phase, setPhase] = useState<Phases>("intro");
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
			{phase === "instructions" && <InstructionsPhase />}
			{phase === "phase1" && <PostPhase />}
			{phase === "instructions-2" && <InstructionsPhase2 />}
			{phase === "phase2" && <FeedPhase />}
		</SurveyContext.Provider>
	);
}

export default App;
