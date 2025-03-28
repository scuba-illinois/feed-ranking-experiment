import { useState, createContext, useContext } from "react";
import { Phases, Post, Survey } from "./types";
import { snapshots } from "./posts";
import { PostQuestionnaire } from "./PostQuestionnaire";
import { PostCard } from "./PostCard";
import chance from "chance";
import Goodbye from "./pages/Gooybye";
import ExitQuestionnaire from "./pages/ExitQuestionnaire";
import IntroPhase from "./pages/Intro";
import InstructionsPhase1 from "./pages/InstructionsPhase1";
import InstructionsPhase2 from "./pages/InstructionsPhase2";
import { Body, Button, Header } from "./components/general";
import Transition from "./pages/Transition";
import { rotatePosts } from "./utils";

export const SurveyContext = createContext<{
	phase: Phases;
	setPhase: (phase: Phases) => void;
	debug: boolean;
	setDebug: (debug: boolean) => void;
	survey: Survey;
	setSurvey: (survey: Survey) => void;
	phase1Posts: Post[];
	phase2Posts: Post[];
	phase3Posts: Post[];
}>({
	phase: "intro",
	setPhase: () => {},
	debug: false,
	setDebug: () => {},
	survey: {
		phase1Snapshot: "",
		phase2Snapshot: "",
		phase3Snapshot: "",
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	},
	setSurvey: () => {},
	phase1Posts: [],
	phase2Posts: [],
	phase3Posts: [],
});

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

function FeedPhase({ posts }: { posts: Post[] }) {
	const { phase } = useContext(SurveyContext);
	const [selectedPost, setSelectedPost] = useState("");
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

	return (
		<PhaseContext.Provider
			value={{
				selectedPost: selectedPost,
				setSelectedPost: setSelectedPost,
				completedPosts: completedPosts,
				setCompletedPosts: setCompletedPosts,
			}}
		>
			<div className="m-3">
				<Header>
					Trending on Reddit ({phase === "phase2" ? "1" : "2"} / 2)
				</Header>
				<Body>To start assessing posts, please click on any post.</Body>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					{posts.map((post, index) => (
						<PostCard key={index} post={post} position={index + 1} />
					))}
				</div>
				{selectedPost && !completedPosts.includes(selectedPost) ? (
					<PostQuestionnaire
						post={posts[posts.findIndex((post) => post.uuid === selectedPost)]}
						postUUID={selectedPost}
						phase={phase as "phase1" | "phase2" | "phase3"}
						position={posts.findIndex((post) => post.uuid === selectedPost) + 1}
					/>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</PhaseContext.Provider>
	);
}

function PostPhase({ selectedPosts }: { selectedPosts: Post[] }) {
	// FIXME: On refresh, the post changes. PATCH: chance object takes a seed that is the participant ID.

	const [currentPost, setCurrentPost] = useState(1);
	const [selectedPost, setSelectedPost] = useState("");
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

	return (
		<PhaseContext.Provider
			value={{
				selectedPost: selectedPost,
				setSelectedPost: setSelectedPost,
				completedPosts: completedPosts,
				setCompletedPosts: setCompletedPosts,
			}}
		>
			<div className="m-3">
				<h2 className="font-bold text-2xl">
					Trending on Reddit (Post {currentPost} / {selectedPosts.length})
				</h2>
				<p className="text-[10pt]">To start assessing the post, click on it.</p>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					<PostCard post={selectedPosts[currentPost - 1]} />
				</div>
				{selectedPost ? (
					<PostQuestionnaire
						post={selectedPosts[currentPost - 1]}
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

function Debug() {
	const { debug, setDebug, survey } = useContext(SurveyContext);

	return (
		<div className="text-[6pt] flex flex-col gap-2 p-4">
			{debug && (
				<div className="font-mono whitespace-pre-wrap text-[6pt]">
					{JSON.stringify(survey, null, 2)}
				</div>
			)}
			<Button
				onClick={() => setDebug(!debug)}
				className={debug ? "bg-red-500 hover:bg-red-600 transition-colors" : ""}
			>
				{debug ? "Disable Debug" : "Enable Debug"}
			</Button>
		</div>
	);
}

function App() {
	// TODO: Pull the assigned posts from the server depending on the participant's ID.

	const [phase, setPhase] = useState<Phases>("phase2");
	const [survey, setSurvey] = useState<Survey>({
		phase1Snapshot: "625a57f7-6ec1-47e7-bbf0-0e4edbad412e", // TODO: Have these randomized.
		phase2Snapshot: "625a57f7-6ec1-47e7-bbf0-0e4edbad412e",
		phase3Snapshot: "625a57f7-6ec1-47e7-bbf0-0e4edbad412e",
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	});
	const [debug, setDebug] = useState(false);

	const posts = snapshots["9591ff0b-7c31-42bd-b7ea-f6851ada90a8"].posts;

	const [phase1Posts] = useState<Post[]>(
		new chance(survey.participant).shuffle(posts).slice(0, 5) // FIXME: The seed is always empty string.
	);
	const [phase2Posts] = useState<Post[]>(posts);
	const [phase3Posts] = useState<Post[]>(rotatePosts(posts, 3)); // Example with n = 3

	return (
		<SurveyContext.Provider
			value={{
				phase: phase,
				setPhase: setPhase,
				debug: debug,
				setDebug: setDebug,
				survey: survey,
				setSurvey: setSurvey,
				phase1Posts: phase1Posts,
				phase2Posts: phase2Posts,
				phase3Posts: phase3Posts,
			}}
		>
			<Debug />
			{phase === "intro" && <IntroPhase />}
			{phase === "instructions" && <InstructionsPhase1 />}
			{phase === "phase1" && <PostPhase selectedPosts={phase1Posts} />}
			{phase === "instructions-2" && <InstructionsPhase2 />}
			{phase === "phase2" && <FeedPhase posts={phase2Posts} />}
			{phase === "transition" && <Transition />}
			{phase === "phase3" && <FeedPhase posts={phase3Posts} />}
			{phase === "exit-questionnaire" && <ExitQuestionnaire />}
			{phase === "exit" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
