import { useState, createContext, useContext } from "react";
import { Phases, Post, Survey } from "./types";
import { posts } from "./posts";
import { PostQuestionnaire } from "./PostQuestionnaire";
import { PostCard } from "./PostCard";
import chance from "chance";
import Goodbye from "./pages/Gooybye";
import ExitQuestionnaire from "./pages/ExitQuestionnaire";
import IntroPhase from "./pages/Intro";
import InstructionsPhase1 from "./pages/InstructionsPhase1";
import InstructionsPhase2 from "./pages/InstructionsPhase2";
import { Button } from "./components/general";

export const SurveyContext = createContext<{
	phase: Phases;
	setPhase: (phase: Phases) => void;
	debug: boolean;
	setDebug: (debug: boolean) => void;
	survey: Survey;
	setSurvey: (survey: Survey) => void;
}>({
	phase: "intro",
	setPhase: () => {},
	debug: false,
	setDebug: () => {},
	survey: {
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	},
	setSurvey: () => {},
});

function FeedPhase() {
	const { debug, survey, setDebug, phase } = useContext(SurveyContext);
	const { selectedPost, setSelectedPost, completedPosts } =
		useContext(PhaseContext);

	return (
		<>
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

export const PhaseContext = createContext<{
	selectedPost: string;
	setSelectedPost: (postUUID: string) => void;
	completedPosts: string[];
	setCompletedPosts: (posts: string[]) => void;
}>({
	selectedPost: "", // Default to an empty string
	setSelectedPost: () => {}, // Default to an empty function
	completedPosts: [], // Default to an empty array
	setCompletedPosts: () => {}, // Default to an empty function
});

function PostPhase({ selectedPosts }: { selectedPosts: Post[] }) {
	// FIXME: On refresh, the post changes. PATCH: chance object takes a seed that is the participant ID.

	const [currentPost, setCurrentPost] = useState(1);
	const [selectedPost, setSelectedPost] = useState("");
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

	return (
		<PhaseContext.Provider
			value={{
				selectedPost,
				setSelectedPost,
				completedPosts,
				setCompletedPosts,
			}}
		>
			<div className="m-3">
				<h2 className="font-bold text-2xl">
					Trending on Reddit (Post {currentPost} / 2)
				</h2>
				<p className="text-[10pt]">To start assessing the post, click on it.</p>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					<PostCard post={selectedPosts[currentPost - 1]} />
				</div>
				{selectedPost ? (
					<PostQuestionnaire
						postUUID={selectedPosts[currentPost - 1].uuid}
						phase="phase1"
						currentPost={currentPost}
						setCurrentPost={setCurrentPost}
					/>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</PhaseContext.Provider>
	);
}

function App() {
	// TODO: Pull the assigned posts from the server depending on the participant's ID.

	const [phase, setPhase] = useState<Phases>("phase1");
	const [survey, setSurvey] = useState<Survey>({
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	});
	const [debug, setDebug] = useState(false);

	const [phase1Posts] = useState<typeof posts>(
		new chance(survey.participant).shuffle(posts).slice(0, 2)
	);

	return (
		<SurveyContext.Provider
			value={{
				phase: phase,
				setPhase: setPhase,
				debug: debug,
				setDebug: setDebug,
				survey: survey,
				setSurvey: setSurvey,
			}}
		>
			<div className="text-[6pt] flex flex-col gap-2 p-4">
				{debug && (
					<div className="font-mono whitespace-pre-wrap text-[6pt]">
						{JSON.stringify(survey, null, 2)}
					</div>
				)}
				<Button
					onClick={() => setDebug(!debug)}
					className={
						debug ? "bg-red-500 hover:bg-red-600 transition-colors" : ""
					}
				>
					{debug ? "Disable Debug" : "Enable Debug"}
				</Button>
			</div>
			{phase === "intro" && <IntroPhase />}
			{phase === "instructions" && <InstructionsPhase1 />}
			{phase === "phase1" && <PostPhase selectedPosts={phase1Posts} />}
			{phase === "instructions-2" && <InstructionsPhase2 />}
			{phase === "phase2" && <FeedPhase />}
			{phase === "phase3" && <FeedPhase />}
			{phase === "exit-questionnaire" && <ExitQuestionnaire />}
			{phase === "exit" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
