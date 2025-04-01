import { useState, useContext, useEffect } from "react";
import { Phases, Survey } from "./types";
import { PostQuestionnaire } from "./PostQuestionnaire";
import Goodbye from "./pages/Goodbye";
import ExitQuestionnaire from "./pages/ExitQuestionnaire";
import IntroPhase from "./pages/Intro";
import InstructionsPhase1 from "./pages/InstructionsPhase1";
import InstructionsPhase2 from "./pages/InstructionsPhase2";
import { Body, Button, Header } from "./components/general";
import Transition from "./pages/Transition";
import { SurveyContext, PhaseContext } from "./contexts";

function FeedView({
	selectedPostUUID,
	setSelectedPostUUID,
	rotationInfo,
	imageHeight,
}: {
	selectedPostUUID: string;
	setSelectedPostUUID: React.Dispatch<React.SetStateAction<string>>;
	rotationInfo: {
		uuid: string;
		x: number;
		y: number;
		height: number;
		width: number;
	}[];
	imageHeight: number;
}) {
	const FEED_IMAGE = "2025-04-01T19:30:19Z/rotation-0.png";

	const { phase } = useContext(SurveyContext);
	const { completedPosts } = useContext(PhaseContext);

	return (
		<div className="flex flex-col w-[530px] shrink-0">
			<div className="m-3">
				<Header>
					Trending on Reddit (Feed {phase === "phase2" ? "1" : "2"} / 2)
				</Header>
				<Body>To start assessing posts, please click on any post.</Body>
			</div>
			<div
				className="overflow-y-scroll w-[530px] rounded-md relative"
				style={{ direction: "rtl" }}
			>
				<div style={{ direction: "ltr" }} className="">
					<div
						className="border-2 overflow-y-clip ml-3"
						style={{ height: `${imageHeight}px`, width: "fit-content" }}
					>
						<img src={FEED_IMAGE} className="w-[500px]" />
					</div>
					{rotationInfo &&
						rotationInfo.map(({ y, height, uuid }) => {
							if (completedPosts.includes(uuid)) {
								return (
									<div
										key={uuid}
										className="py-2 px-3 shadow-lg rounded-md
                   text-[10pt]  bg-white border-2
                    transition-colors"
										style={{
											left: "494px",
											top: `${height / 2 + y - 20}px`,
											position: "absolute",
										}}
									>
										{"✅"}
									</div>
								);
							}

							if (uuid === selectedPostUUID) {
								return (
									<div
										key={uuid}
										className="py-2 px-3 shadow-lg rounded-md
                   text-[10pt]  text-white bg-amber-600
                    transition-colors"
										style={{
											left: "497px",
											top: `${height / 2 + y - 20}px`,
											position: "absolute",
										}}
									>
										{"<"}
									</div>
								);
							}

							return (
								<button
									key={uuid}
									onClick={() => setSelectedPostUUID(uuid)}
									className="py-2 px-3 shadow-lg rounded-md
                   text-[10pt] bg-blue-500 text-white hover:bg-blue-600
                    transition-colors"
									style={{
										left: "497px",
										top: `${height / 2 + y - 20}px`,
										position: "absolute",
									}}
								>
									{">"}
								</button>
							);
						})}
				</div>
			</div>
		</div>
	);
}

function FeedPhase() {
	const { phase } = useContext(SurveyContext);
	const [selectedPostUUID, setSelectedPostUUID] = useState<string>("");
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

	const [rotationInfo, setRotationInfo] = useState<
		| {
				uuid: string;
				x: number;
				y: number;
				height: number;
				width: number;
		  }[]
		| undefined
	>(undefined);
	const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);

	useEffect(() => {
		fetch("2025-04-01T19:30:19Z/rotation-0.json", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then((response) =>
			response.json().then((info) => {
				setRotationInfo(info);
				setImageHeight(info[9].height + info[9].y);
			})
		);
	}, []);

	return (
		<PhaseContext.Provider
			value={{
				selectedPostUUID: selectedPostUUID,
				setSelectedPostUUID: setSelectedPostUUID,
				completedPosts: completedPosts,
				setCompletedPosts: setCompletedPosts,
			}}
		>
			<div className="flex justify-center h-[100vh] gap-2 p-4 ">
				<FeedView
					selectedPostUUID={selectedPostUUID}
					setSelectedPostUUID={setSelectedPostUUID}
					rotationInfo={rotationInfo!} // The ! might be bad.
					imageHeight={imageHeight!}
				/>

				{/* <div className="w-1/2 flex flex-col gap-2">
					{posts.map((post, index) => (
						<PostCard key={index} post={post} position={index + 1} />
					))}
				</div> */}

				{selectedPostUUID && !completedPosts.includes(selectedPostUUID) ? (
					<PostQuestionnaire
						phase={phase as "phase1" | "phase2" | "phase3"}
						postUUID={selectedPostUUID}
						position={
							rotationInfo?.findIndex(
								(info) => info.uuid === selectedPostUUID
							)! + 1
						}
					/>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</PhaseContext.Provider>
	);
}

// function PostPhase({ selectedPosts }: { selectedPosts: Post[] }) {
// 	// FIXME: On refresh, the post changes. PATCH: chance object takes a seed that is the participant ID.

// 	const [currentPost, setCurrentPost] = useState(1);
// 	const [selectedPost, setSelectedPost] = useState("");
// 	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

// 	return (
// 		<PhaseContext.Provider
// 			value={{
// 				selectedPost: selectedPost,
// 				setSelectedPost: setSelectedPost,
// 				completedPosts: completedPosts,
// 				setCompletedPosts: setCompletedPosts,
// 			}}
// 		>
// 			<div className="m-3">
// 				<h2 className="font-bold text-2xl">
// 					Trending on Reddit (Post {currentPost} / {selectedPosts.length})
// 				</h2>
// 				<p className="text-[10pt]">To start assessing the post, click on it.</p>
// 			</div>
// 			<div className="flex justify-center gap-2 m-3">
// 				<div className="w-1/2 flex flex-col gap-2">
// 					<PostCard post={selectedPosts[currentPost - 1]} />
// 				</div>
// 				{selectedPost ? (
// 					<PostQuestionnaire
// 						post={selectedPosts[currentPost - 1]}
// 						postUUID={selectedPosts[currentPost - 1].uuid}
// 						phase="phase1"
// 						currentPost={currentPost}
// 						setCurrentPost={setCurrentPost}
// 					/>
// 				) : (
// 					<div className="w-1/2"></div>
// 				)}
// 			</div>
// 		</PhaseContext.Provider>
// 	);
// }

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
	const [phase, setPhase] = useState<Phases>("phase2");
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
				survey: survey,
				setSurvey: setSurvey,
			}}
		>
			<Debug />
			{phase === "intro" && <IntroPhase />}
			{phase === "instructions" && <InstructionsPhase1 />}
			{/* {phase === "phase1" && <PostPhase selectedPosts={phase1Posts} />} */}
			{phase === "instructions-2" && <InstructionsPhase2 />}
			{phase === "phase2" && <FeedPhase />}
			{phase === "transition" && <Transition />}
			{phase === "phase3" && <FeedPhase />}
			{phase === "exit-questionnaire" && <ExitQuestionnaire />}
			{phase === "exit" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
