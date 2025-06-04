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
import { formatTime } from "./utils";

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
				left: "475px",
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
			className="border-2 overflow-y-clip "
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
	const [isVisible, setIsVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);

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

	useEffect(() => {
		if (!isVisible || timeLeft <= 0) {
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setIsVisible(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1_000);

		return () => clearInterval(timer);
	}, [isVisible, timeLeft]);

	// const { data, setData } = useContext(SurveyContext);

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	} else {
		return (
			<div className="flex justify-center h-[100vh] gap-2 p-4">
				<div className="flex flex-col w-[560px]">
					<div className="m-3">
						<Header>Trending on Reddit</Header>
						<Body>To start assessing posts, please click on any post.</Body>
						{isVisible && <Body>{formatTime(timeLeft)}</Body>}
					</div>
					{!isVisible && (
						<button
							className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors mb-4"
							onClick={() => {
								setIsVisible(true);
								setTimeLeft(10); // Reset to 10 seconds
							}}
						>
							Show Feed
						</button>
					)}

					{isVisible && (
						<div
							className="overflow-y-scroll relative w-[560px] grid justify-items-end" // Why does grid work?
							style={{ direction: "rtl" }}
						>
							<FeedView
								fileName={FEED_IMAGE}
								// Use the last post's y and height to set the image height.
								height={feedData[9].y + feedData[9].height}
							/>
							<FeedButtons feedData={feedData} />
						</div>
					)}
				</div>
			</div>
		);
	}
}

function App() {
	const [data, setData] = useState<object>({});

	return (
		<SurveyContext.Provider value={{ data, setData }}>
			<Feed />
		</SurveyContext.Provider>
	);
}

export default App;
