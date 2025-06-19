import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { FeedData, SelectionLogs } from "../types";
import { Body, Header } from "../components/general";
import { formatTime } from "../utils";

const TIMER_SETTING = 120;

const Directions = () => {
	const { feeds, completedFeeds } = useContext(SurveyContext);

	const feed = ["first", "second", "third and final"][completedFeeds.length];

	return (
		<div className="flex flex-col gap-2 mb-2">
			<Header>
				Directions (Feed {(completedFeeds.length + 1).toLocaleString()} /{" "}
				{feeds.length.toLocaleString()})
			</Header>
			<Body>
				You'll be shown three screenshots of Reddit's r/popular feed, each
				containing 10 posts. <i>This is your {feed} feed.</i>
			</Body>
			<Body>
				You have 2 minutes to select <i>up to 3 posts</i> you'd want to read
				more about by clicking the "Select" button next to each post.
			</Body>
			<Body>Click "Show Feed" to begin. A timer will appear below.</Body>
			<Body>When you're done, click "Continue".</Body>
		</div>
	);
};

const ShowFeedButton = ({
	setIsVisible,
	setTimeLeft,
	setLogs,
}: {
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
	setLogs: React.Dispatch<React.SetStateAction<SelectionLogs>>;
}) => (
	<button
		className="py-2 px-3 mt-1 shadow-lg rounded-md text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors"
		onClick={() => {
			setIsVisible(true);
			setTimeLeft(TIMER_SETTING);
			setLogs((state) => [
				...state,
				{
					timestamp: new Date().toISOString(),
					action: "START",
				},
			]);
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
				left: `${473 + 22}px`, // MAGIC NUMBER
				top: `${height / 2 + y - 20}px`, // MAGIC NUMBER
			}}
		>
			{showTooMany && (
				<div
					className="px-2 py-1 shadow-lg rounded-md bg-white text-black border-3 text-sm"
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
				action: "UNSELECT",
				uuid: uuid,
			},
		]);
	};

	return (
		<button
			className="py-2 px-3 rounded-md shadow-lg text-[10pt] text-white bg-red-500 hover:bg-red-600 transition-colors"
			style={{
				position: "absolute",
				left: `${464 + 22}px`, // MAGIC NUMBER
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
	const { setPhase, setAnswers, feeds, completedFeeds } =
		useContext(SurveyContext);

	// Figure out which feed you're on so you can save the answers correctly.
	const feedUUID = feeds[completedFeeds.length];

	const isDisabled = selectedPosts.length < 1;

	const onClick = () => {
		setPhase("FEEDRATING");

		setAnswers((state) => ({
			...state,
			[feedUUID]: {
				selectedPosts: selectedPosts,
				selectionLogs: [
					...logs,
					{
						timestamp: new Date().toISOString(),
						action: "END",
					},
				],
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
	const { feeds, rotations, completedFeeds } = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];
	const rotation = rotations[completedFeeds.length];

	const fileName = `${feedUUID}/rotation-${rotation}.png`;

	const [isVisible, setIsVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [timeExpired, setTimeExpired] = useState(false);
	const [feedData, setFeedData] = useState<FeedData | null>(null); // TODO: Have this read in earlier.
	const [_selectedPosts, _setSelectedPosts] = useState<string[]>([]);
	const [_logs, _setLogs] = useState<SelectionLogs>([]);

	// Retrieve the JSON describing the image.
	useEffect(() => {
		fetch(`${feedUUID}/rotation-${rotation}.json`, {
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
					setTimeExpired(true);
					_setLogs((state) => [
						...state,
						{
							timestamp: new Date().toISOString(),
							action: "TIME_EXPIRED",
							uuid: feedUUID,
						},
					]);
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
		<div className="flex justify-center h-[100vh] gap-2 py-4">
			<div className="flex flex-col w-[560px]">
				<Directions />

				{!isVisible && (
					<ShowFeedButton
						setIsVisible={setIsVisible}
						setTimeLeft={setTimeLeft}
						setLogs={_setLogs}
					/>
				)}

				{isVisible && (
					<Status timeLeft={timeLeft} selectedPosts={_selectedPosts} />
				)}
				{timeExpired && (
					<Body className="mb-2">
						Time has expired.{" "}
						{_selectedPosts.length < 1
							? "Select at least one post to move on."
							: 'Please click "Continue" to proceed.'}
					</Body>
				)}
				{isVisible && (
					<ContinueButton selectedPosts={_selectedPosts} logs={_logs} />
				)}

				{isVisible && (!timeExpired || _selectedPosts.length < 1) && (
					<div
						className="overflow-y-scroll relative grid justify-items-end pl-6 w-[600px]"
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
