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

function FeedButtons({
	feedData,
	selectedPosts,
	setSelectedPosts,
}: {
	feedData: FeedData;
	selectedPosts: string[];
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	function FlagButton({
		uuid,
		height,
		y,
	}: {
		uuid: string;
		height: number;
		y: number;
	}) {
		return (
			<button
				key={uuid}
				className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
				style={{
					position: "absolute",
					left: "475px",
					top: `${height / 2 + y - 20}px`,
				}}
				onClick={() => {
					if (selectedPosts.length < 3) {
						setSelectedPosts((state) => [...state, uuid]);
					}
				}}
			>
				Flag
			</button>
		);
	}

	function UnflagButton({
		uuid,
		height,
		y,
	}: {
		uuid: string;
		height: number;
		y: number;
	}) {
		return (
			<button
				key={uuid}
				className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-orange-500 text-white hover:bg-orange-600 transition-colors"
				style={{
					position: "absolute",
					left: "470px",
					top: `${height / 2 + y - 20}px`,
				}}
				onClick={() =>
					setSelectedPosts((state) => state.filter((_uuid) => _uuid !== uuid))
				}
			>
				Unflag
			</button>
		);
	}

	return feedData.map(({ y, height, uuid }) => {
		if (!selectedPosts.includes(uuid)) {
			return <FlagButton uuid={uuid} height={height} y={y} />;
		} else {
			return <UnflagButton uuid={uuid} height={height} y={y} />;
		}
	});
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
	const TIMER_SETTING = 1200000;

	const [feedData, setFeedData] = useState<FeedData | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

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

	// Handling timer.
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
				<div className="flex flex-col w-[530px]">
					<div className="flex flex-col gap-2 mb-4">
						<Header>Directions</Header>
						<Body>
							Here, you will be shown a screenshot of Reddit's r/popular feed
							containing 10 posts. You will have 2 minutes to browse and select
							at most 3 posts from this feed that you would like to read more
							about.
						</Body>
						<Body>
							Next to each post on the screenshot of the feed, there is a "Flag"
							button to denote that you would like to read more about this post.
						</Body>
						<Body>
							To start, press the "Show Feed" button. The timer and feed will
							appear below once to press the button.
						</Body>
						{isVisible && (
							<div className="flex justify-between items-center w-full">
								<Body>
									<b className="text-black">Time Remaining: </b>
									{formatTime(timeLeft)}
								</Body>
								<Body>
									<span>
										<b className="text-black">Posts Selected:</b>{" "}
										{selectedPosts.length.toLocaleString()}
									</span>
								</Body>
							</div>
						)}
						{!isVisible && (
							<button
								className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
								onClick={() => {
									setIsVisible(true);
									setTimeLeft(TIMER_SETTING);
								}}
							>
								Show Feed
							</button>
						)}
					</div>

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
							<FeedButtons
								feedData={feedData}
								selectedPosts={selectedPosts}
								setSelectedPosts={setSelectedPosts}
							/>
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
