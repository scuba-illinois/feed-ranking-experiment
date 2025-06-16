import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { FeedData, SelectionLogs } from "../types";
import { Body, Header } from "../components/general";
import { formatTime } from "../utils";

const Directions = () => (
	<div className="flex flex-col gap-2 mb-2">
		<Header>Directions</Header>
		<Body>
			Here, you will be shown a screenshot of Reddit's r/popular feed containing
			10 posts. You will have 2 minutes to browse and select at most 3 posts
			from this feed that you would like to read more about if you had the
			chance.
		</Body>
		<Body>
			Next to each post on the screenshot of the feed, there is a "Select"
			button to denote that you would like to read more about this post.
		</Body>
		<Body>
			To start, press the "Show Feed" button. The timer and feed will appear
			below once you press the button.
		</Body>
		<Body>
			Once you have selected the posts you are interested in, please hit
			'Continue'.
		</Body>
	</div>
);

const ShowFeedButton = ({
	setIsVisible,
	setTimeLeft,
	TIMER_SETTING = 120,
}: {
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
	TIMER_SETTING: number;
}) => (
	<button
		className="py-2 px-3 shadow-lg rounded-md text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors"
		onClick={() => {
			setIsVisible(true);
			setTimeLeft(TIMER_SETTING);
		}}
	>
		Show Feed
	</button>
);

export const FeedView = ({
	fileName,
	height,
}: {
	fileName: string;
	height: number;
}) => (
	<div
		className="border-2 overflow-y-clip"
		style={{
			height: `${height}px`,
			width: "fit-content",
		}}
	>
		<img src={fileName} className="w-[500px]" />
	</div>
);

const SelectButton = ({
	uuid,
	height,
	y,
	selectedPosts,
	setSelectedPosts,
	setLogs,
}: {
	uuid: string;
	height: number;
	y: number;
	selectedPosts: string[];
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[]>>;
	setLogs: React.Dispatch<React.SetStateAction<SelectionLogs>>;
}) => {
	const [showTooMany, setShowTooMany] = useState(false);

	const handleSelect = () => {
		if (selectedPosts.length >= 3) {
			setShowTooMany(true);
			setTimeout(() => setShowTooMany(false), 2000); // Show for 2 seconds
			return;
		}

		setSelectedPosts((prev) => [...prev, uuid]);
		setLogs((state) => [
			...state,
			{
				timestamp: new Date().toISOString(),
				action: "SELECT",
				uuid: uuid,
			},
		]);
	};

	return (
		<div
			style={{
				position: "absolute",
				left: `${485 + 55}px`, // MAGIC NUMBER
				top: `${height / 2 + y - 20}px`, // MAGIC NUMBER
			}}
		>
			{showTooMany && (
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
			)}
			<button
				className="py-2 px-3 shadow-lg rounded-md text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors"
				onClick={handleSelect}
			>
				Select
			</button>
		</div>
	);
};

const UnselectButton = ({
	uuid,
	height,
	y,
	setSelectedPosts,
	setLogs,
}: {
	uuid: string;
	height: number;
	y: number;
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[]>>;
	setLogs: React.Dispatch<React.SetStateAction<SelectionLogs>>;
}) => {
	const handleUnselect = () => {
		setSelectedPosts((state) => state.filter((_uuid) => _uuid !== uuid));
		setLogs((state) => [
			...state,
			{
				timestamp: new Date().toISOString(),
				action: "DESELECT",
				uuid: uuid,
			},
		]);
	};

	return (
		<button
			className="py-2 px-3 shadow-lg rounded-md text-[10pt] text-white bg-red-500 hover:bg-red-600 transition-colors"
			style={{
				position: "absolute",
				left: `${485 + 55}px`, // MAGIC NUMBER
				top: `${height / 2 + y - 20}px`, // MAGIC NUMBER
			}}
			onClick={handleUnselect}
		>
			Unselect
		</button>
	);
};

const FeedButtons = ({
	feedData,
	selectedPosts,
	setSelectedPosts,
	setLogs,
}: {
	feedData: FeedData;
	selectedPosts: string[];
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[]>>;
	setLogs: React.Dispatch<React.SetStateAction<SelectionLogs>>;
}) => {
	return feedData.map(({ y, height, uuid }) => {
		if (selectedPosts.includes(uuid)) {
			return (
				<UnselectButton
					key={uuid}
					uuid={uuid}
					height={height}
					y={y}
					setLogs={setLogs}
					setSelectedPosts={setSelectedPosts}
				/>
			);
		} else {
			return (
				<SelectButton
					key={uuid}
					uuid={uuid}
					height={height}
					y={y}
					setLogs={setLogs}
					selectedPosts={selectedPosts}
					setSelectedPosts={setSelectedPosts}
				/>
			);
		}
	});
};

const Status = ({
	timeLeft,
	selectedPosts,
}: {
	timeLeft: number;
	selectedPosts: string[];
}) => {
	return (
		<div className="flex justify-between items-center w-full mb-2">
			<Body>
				<b className="text-black">Time Remaining: </b>
				{formatTime(timeLeft)}
			</Body>
			<Body>
				<b className="text-black">Posts Selected: </b>
				{selectedPosts.length.toLocaleString()}
			</Body>
		</div>
	);
};

const ContinueButton = ({
	selectedPosts,
	logs,
}: {
	selectedPosts: string[];
	logs: SelectionLogs;
}) => {
	const { setPhase, setAnswers, feeds } = useContext(SurveyContext);

	const isDisabled = selectedPosts.length < 1;

	const onClick = () => {
		setPhase("FEEDRATING");

		setAnswers((state) => ({
			...state,
			[feeds[0]]: {
				selectedPosts: selectedPosts,
				selectionLogs: logs,
			},
		}));
	};

	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			className={
				"py-2 px-3 mt-1 mb-4 shadow-lg rounded-md text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors" +
				(isDisabled ? " opacity-50 cursor-not-allowed" : "")
			}
		>
			Continue
		</button>
	);
};

export const FeedSelect = () => {
	const { feeds, rotations } = useContext(SurveyContext);

	const fileName = `${feeds[0]}/rotation-${rotations[0]}.png`;

	const TIMER_SETTING = 120; // Number of seconds.

	const [isVisible, setIsVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [feedData, setFeedData] = useState<FeedData | null>(null); // TODO: Have this read in earlier.
	const [_selectedPosts, _setSelectedPosts] = useState<string[]>([]);
	const [_logs, _setLogs] = useState<SelectionLogs>([]);

	// Retrieve the JSON describing the image.
	useEffect(() => {
		fetch(`${feeds[0]}/rotation-${rotations[0]}.json`, {
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
					return 0;
				}
				return prev - 1;
			});
		}, 1_000);

		return () => clearInterval(timer);
	}, [isVisible, timeLeft]);

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px]">
				<Directions />

				{!isVisible && (
					<ShowFeedButton
						setIsVisible={setIsVisible}
						setTimeLeft={setTimeLeft}
						TIMER_SETTING={TIMER_SETTING}
					/>
				)}

				{isVisible && (
					<Status timeLeft={timeLeft} selectedPosts={_selectedPosts} />
				)}
				{isVisible && (
					<ContinueButton selectedPosts={_selectedPosts} logs={_logs} />
				)}

				{isVisible && (
					<div
						className="overflow-y-scroll relative w-[650px] grid justify-items-end pl-4"
						style={{ direction: "rtl" }}
					>
						<FeedView
							fileName={fileName}
							height={feedData[9].y + feedData[9].height}
						/>
						<FeedButtons
							feedData={feedData}
							selectedPosts={_selectedPosts}
							setSelectedPosts={_setSelectedPosts}
							setLogs={_setLogs}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
