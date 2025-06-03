import { useState, useContext, useEffect } from "react";
// import { Phases, Survey } from "./types";
// import { PostQuestionnaire } from "./PostQuestionnaire";
// import Goodbye from "./pages/Goodbye";
// import ExitQuestionnaire from "./pages/ExitQuestionnaire";
// import IntroPhase from "./pages/Intro";
// import InstructionsPhase1 from "./pages/InstructionsPhase1";
// import InstructionsPhase2 from "./pages/InstructionsPhase2";
import { Body, Header } from "./components/general";
// import Transition from "./pages/Transition";
import { SurveyContext } from "./contexts";

const snapshots = ["2025-04-01T19:30:19Z"];

type FeedData = {
	uuid: string;
	height: number;
	width: number;
	x: number;
	y: number;
}[];

function FeedButtons({ feedData }: { feedData: FeedData }) {
	return feedData.map(({ y, height, uuid }) => (
		<button
			key={uuid}
			className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
			style={{
				position: "absolute",
				left: "497px",
				top: `${height / 2 + y - 20}px`,
			}}
		>
			Flag
		</button>
	));
}

function FeedView({ fileName, height }: { fileName: string; height: number }) {
	return (
		<div
			className="border-2 overflow-y-clip ml-3"
			style={{ height: `${height}px`, width: "fit-content" }}
		>
			<img src={fileName} className="w-[500px]" />
		</div>
	);
}

function Feed() {
	// TODO: Randomize this, right now you're just using one rotation/snapshot.
	const FEED_IMAGE = `${snapshots[0]}/rotation-${0}.png`;

	const [feedData, setFeedData] = useState<FeedData | null>(null);

	// Retrieve the JSON describing the image.
	useEffect(() => {
		fetch(`${snapshots[0]}/rotation-${0}.json`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then((response) =>
			response.json().then((data: FeedData) => {
				setFeedData(data);
			})
		);
	}, []);

	// const { data, setData } = useContext(SurveyContext);

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	} else {
		return (
			<div className="flex justify-center h-[100vh] gap-2 p-4">
				<div className="flex flex-col w-[530px] shrink-0">
					<div className="m-3">
						<Header>Trending on Reddit</Header>
						<Body>To start assessing posts, please click on any post.</Body>
					</div>

					<div
						className="overflow-y-scroll w-[530px] relative"
						style={{ direction: "rtl" }}
					>
						<div style={{ direction: "ltr" }}>
							<FeedView
								fileName={FEED_IMAGE}
								// Use the last post's y and height to set the image height.
								height={feedData[9].y + feedData[9].height}
							/>
							<FeedButtons feedData={feedData} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// function FeedPhase({
// 	snapshot,
// 	rotation,
// }: {
// 	snapshot: string;
// 	rotation: number; // FIXME: Could be more strict on the rotation type.
// }) {
// 	const { phase } = useContext(SurveyContext);
// 	const [selectedPostUUID, setSelectedPostUUID] = useState<string>("");
// 	const [completedPosts, setCompletedPosts] = useState<string[]>([]);

// 	const [rotationInfo, setRotationInfo] = useState<
// 		| {
// 				uuid: string;
// 				x: number;
// 				y: number;
// 				height: number;
// 				width: number;
// 		  }[]
// 		| undefined
// 	>(undefined);
// 	const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);

// 	useEffect(() => {
// 		fetch(`${snapshot}/rotation-${rotation}.json`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 				Accept: "application/json",
// 			},
// 		}).then((response) =>
// 			response.json().then((info) => {
// 				setRotationInfo(info);
// 				setImageHeight(info[9].height + info[9].y);
// 			})
// 		);
// 	}, []);

// 	return (
// 		<PhaseContext.Provider
// 			value={{
// 				selectedPostUUID: selectedPostUUID,
// 				setSelectedPostUUID: setSelectedPostUUID,
// 				completedPosts: completedPosts,
// 				setCompletedPosts: setCompletedPosts,
// 			}}
// 		>
// 			<div className="flex justify-center h-[100vh] gap-2 p-4 ">
// 				<FeedView
// 					snapshot={snapshot}
// 					rotation={rotation}
// 					selectedPostUUID={selectedPostUUID}
// 					setSelectedPostUUID={setSelectedPostUUID}
// 					rotationInfo={rotationInfo!} // The ! might be bad.
// 					imageHeight={imageHeight!}
// 				/>

// 				{selectedPostUUID && !completedPosts.includes(selectedPostUUID) ? (
// 					<PostQuestionnaire
// 						phase={phase as "phase1" | "phase2" | "phase3"}
// 						postUUID={selectedPostUUID}
// 						position={
// 							rotationInfo?.findIndex(
// 								(info) => info.uuid === selectedPostUUID
// 							)! + 1
// 						}
// 					/>
// 				) : (
// 					<div className="w-1/2"></div>
// 				)}
// 			</div>
// 		</PhaseContext.Provider>
// 	);
// }

// function Debug() {
// 	const { debug, setDebug, survey } = useContext(SurveyContext);

// 	return (
// 		<div className="text-[6pt] flex flex-col gap-2 p-4">
// 			{debug && (
// 				<div className="font-mono whitespace-pre-wrap text-[6pt]">
// 					{JSON.stringify(survey, null, 2)}
// 				</div>
// 			)}
// 			<Button
// 				onClick={() => setDebug(!debug)}
// 				className={debug ? "bg-red-500 hover:bg-red-600 transition-colors" : ""}
// 			>
// 				{debug ? "Disable Debug" : "Enable Debug"}
// 			</Button>
// 		</div>
// 	);
// }

function App() {
	const [data, setData] = useState<object>({});

	// useEffect(() => {
	// 	fetch(`${snapshots[0]}/rotation-0.json`, {
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Accept: "application/json",
	// 		},
	// 	}).then((response) =>
	// 		response.json().then((info) => {
	// 			setPhase1Posts(
	// 				info
	// 					.map((info: { uuid: string }) => info.uuid)
	// 					.sort(() => Math.random() - 0.5) // Shuffle the array
	// 					.slice(0, 5) // Select the first 5 elements
	// 			);
	// 		})
	// 	);
	// }, []);

	return (
		<SurveyContext.Provider value={{ data, setData }}>
			<Feed />

			{/* <Debug /> */}
			{/* {phase === "intro" && <IntroPhase />} */}
			{/* {phase === "instructions" && <InstructionsPhase1 />} */}

			{/* {phase === "phase1" && (
				<PostPhase
					snapshot={selectedSnapshots["phase1"]}
					postUUIDs={phase1Posts}
				/>
			)}
			{phase === "instructions-2" && <InstructionsPhase2 />}
			{phase === "phase2" && (
				<FeedPhase
					snapshot={selectedSnapshots["phase2"]}
					rotation={selectedRotation["phase2"]}
				/>
			)}
			{phase === "transition" && <Transition />}
			{phase === "phase3" && (
				<FeedPhase
					snapshot={selectedSnapshots["phase3"]}
					rotation={selectedRotation["phase3"]}
				/>
			)}
			{phase === "exit-questionnaire" && <ExitQuestionnaire />}
			{phase === "exit" && <Goodbye />} */}
		</SurveyContext.Provider>
	);
}

export default App;
