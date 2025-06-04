import { useState, useContext, useEffect } from "react";
import { Body, Header } from "./components/general";
import { SurveyContext } from "./contexts";
import { formatTime } from "./utils";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import { FeedData, Logs } from "./types";

const snapshots = ["2025-04-01T19:30:19Z"];

function FeedButtons({
	feedData,
	selectedPosts,
	setSelectedPosts,
	setLogs,
}: {
	feedData: FeedData;
	selectedPosts: string[];
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[]>>;
	setLogs: React.Dispatch<React.SetStateAction<Logs>>;
}) {
	const [showLimitMsg, setShowLimitMsg] = useState<string | null>(null);

	function FlagButton({
		uuid,
		height,
		y,
	}: {
		uuid: string;
		height: number;
		y: number;
	}) {
		const handleClick = () => {
			if (selectedPosts.length < 3) {
				setSelectedPosts((state) => [...state, uuid]);
				setLogs((state) => [
					...state,
					{
						timestamp: new Date().toISOString(),
						uuid: uuid,
						action: "SELECT",
					},
				]);
				setShowLimitMsg(null);
			} else {
				console.log(uuid);
				setShowLimitMsg(uuid);
				setTimeout(() => {
					setShowLimitMsg((current) => (current === uuid ? null : current));
				}, 5_000);
			}
		};

		function TooManySelected() {
			return (
				<div
					className="px-2 py-1 rounded-md bg-white text-black border-3 text-sm"
					style={{
						position: "absolute",
						direction: "ltr",
						top: "2px",
						left: "-200px",
						zIndex: 10,
					}}
				>
					Too many posts selected.
				</div>
			);
		}

		return (
			<div
				style={{
					position: "absolute",
					left: "485px", // MAGIC NUMBER
					top: `${height / 2 + y - 20}px`,
				}}
			>
				{showLimitMsg === uuid && <TooManySelected />}
				<button
					className="py-2 px-3 shadow-lg rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					onClick={handleClick}
				>
					Select
				</button>
			</div>
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
		const handleClick = () => {
			setSelectedPosts((state) => state.filter((_uuid) => _uuid !== uuid));
			setLogs((state) => [
				...state,
				{
					timestamp: new Date().toISOString(),
					uuid: uuid,
					action: "DESELECT",
				},
			]);
		};

		return (
			<button
				key={uuid}
				className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-orange-500 text-white hover:bg-orange-600 transition-colors"
				style={{
					position: "absolute",
					left: "480px", // MAGIC NUMBER
					top: `${height / 2 + y - 20}px`,
				}}
				onClick={() => handleClick()}
			>
				Deselect
			</button>
		);
	}

	return feedData.map(({ y, height, uuid }) => {
		if (!selectedPosts.includes(uuid)) {
			return <FlagButton key={uuid} uuid={uuid} height={height} y={y} />;
		} else {
			return <UnflagButton key={uuid} uuid={uuid} height={height} y={y} />;
		}
	});
}

function FeedView({
	fileName,
	height,
}: {
	fileName: string;
	height: number;
	feedData: FeedData;
}) {
	return (
		<div
			className="border-2 overflow-y-clip "
			style={{ height: `${height}px`, width: "fit-content" }}
		>
			<img src={fileName} className="w-[500px]" />
		</div>
	);
}

function Directions() {
	return (
		<>
			<Header>Directions</Header>
			<Body>
				Here, you will be shown a screenshot of Reddit's r/popular feed
				containing 10 posts. You will have 2 minutes to browse and select at
				most 3 posts from this feed that you would like to read more about.
			</Body>
			<Body>
				Next to each post on the screenshot of the feed, there is a "Flag"
				button to denote that you would like to read more about this post.
			</Body>
			<Body>
				To start, press the "Show Feed" button. The timer and feed will appear
				below once to press the button.
			</Body>
		</>
	);
}

function Feed() {
	// TODO: Randomize this, right now you're just using one rotation/snapshot.
	const FEED_IMAGE = `${snapshots[0]}/rotation-${0}.png`;
	const TIMER_SETTING = 1200000;

	const { setData, setPhase } = useContext(SurveyContext);

	const [feedData, setFeedData] = useState<FeedData | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
	const [logs, setLogs] = useState<Logs>([]);

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

	function ShowFeedButton() {
		return (
			<button
				className="py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
				onClick={() => {
					setIsVisible(true);
					setTimeLeft(TIMER_SETTING);
					setLogs((state) => [
						...state,
						{
							timestamp: new Date().toISOString(),
							action: "START",
							uuid: "",
						},
					]);
				}}
			>
				Show Feed
			</button>
		);
	}

	function CompleteSelectionButton() {
		return (
			<button
				className="py-2 px-3 mt-4 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
				onClick={() => {
					setPhase("end");
					setData((state: object) => ({
						...state,
						selectedPosts: selectedPosts,
						logs: [
							...logs,
							{
								timestamp: new Date().toISOString(),
								action: "END",
								uuid: "",
							},
						],
					}));
				}}
			>
				Complete Selection
			</button>
		);
	}

	function SelectionInfo() {
		return (
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
		);
	}

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px]">
				<div className="flex flex-col gap-2 mb-4">
					<Directions />
					{isVisible && <SelectionInfo />}
					{!isVisible && <ShowFeedButton />}
					{selectedPosts.length === 3 && <CompleteSelectionButton />}
				</div>

				{isVisible && (
					<div
						className="overflow-y-scroll relative w-[580px] grid justify-items-end pl-4" // Why does grid work?
						style={{ direction: "rtl" }}
					>
						<FeedView
							fileName={FEED_IMAGE}
							// Use the last post's y and height to set the image height.
							height={feedData[9].y + feedData[9].height}
							feedData={feedData}
						/>
						<FeedButtons
							feedData={feedData}
							selectedPosts={selectedPosts}
							setSelectedPosts={setSelectedPosts}
							setLogs={setLogs}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

function App() {
	const [data, setData] = useState({});
	const [phase, setPhase] = useState("start");

	return (
		<SurveyContext.Provider value={{ data, setData, phase, setPhase }}>
			{phase === "start" && <Intro />}
			{phase === "feed" && <Feed />}
			{phase === "end" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
