import { useState, useContext, useEffect } from "react";
import { Body, Header } from "./components/general";
import { SurveyContext } from "./contexts";
import { formatTime } from "./utils";
import Goodbye from "./pages/Goodbye";
import Intro from "./pages/Intro";
import { FeedData, Logs } from "./types";
import React from "react";

const snapshots = ["2025-04-01T19:30:19Z"];

const QUESTIONS = [
	"This post is relevant to me.",
	"This post is trustworthy.",
	"This post is high quality.",
];

// TODO: Move this inside the Feed component.
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

	const SelectButton = ({
		uuid,
		height,
		y,
	}: {
		uuid: string;
		height: number;
		y: number;
	}) => {
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
				setShowLimitMsg(uuid);
				setTimeout(() => {
					setShowLimitMsg((current) => (current === uuid ? null : current));
				}, 5_000);
			}
		};

		const TooManySelected = () => {
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
		};

		return (
			<div
				style={{
					position: "absolute",
					left: "485px", // MAGIC NUMBER
					top: `${height / 2 + y - 20}px`, // MAGIC NUMBER
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
	};

	const UnselectButton = ({
		uuid,
		height,
		y,
	}: {
		uuid: string;
		height: number;
		y: number;
	}) => {
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
	};

	return feedData.map(({ y, height, uuid }) => {
		if (!selectedPosts.includes(uuid)) {
			return <SelectButton key={uuid} uuid={uuid} height={height} y={y} />;
		} else {
			return <UnselectButton key={uuid} uuid={uuid} height={height} y={y} />;
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

function Feed() {
	// TODO: Randomize this, right now you're just using one rotation/snapshot.
	const FEED_IMAGE = `${snapshots[0]}/rotation-${0}.png`;
	const TIMER_SETTING = 120;

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

	const Directions = () => (
		<>
			<Header>Directions</Header>
			<Body>
				Here, you will be shown a screenshot of Reddit's r/popular feed
				containing 10 posts. You will have 2 minutes to browse and select at
				most 3 posts from this feed that you would like to read more about if
				you had the chance.
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
		</>
	);

	const ShowFeedButton = () => (
		<button
			className={
				"py-2 px-3 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors"
			}
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

	const CompleteSelectionButton = () => (
		<button
			className={
				"py-2 px-3 mt-4 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors" +
				(selectedPosts.length < 1 ? " opacity-50 cursor-not-allowed" : "")
			}
			onClick={() => {
				setPhase("rate");
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
			disabled={selectedPosts.length < 1}
		>
			Continue
		</button>
	);

	const SelectionInfo = () => (
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

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px]">
				<div className="flex flex-col gap-2 mb-4">
					<Directions />
					{isVisible && <SelectionInfo />}
					{isVisible && <CompleteSelectionButton />}
					{!isVisible && <ShowFeedButton />}
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

const FeedRate = () => {
	const FEED_IMAGE = `${snapshots[0]}/rotation-${0}.png`;

	const { data, setData, setPhase } = useContext(SurveyContext);

	const [feedData, setFeedData] = useState<FeedData | null>(null);
	const [selectedPost, setSelectedPost] = useState<string | null>(null);
	const [ratings, setRatings] = useState<Record<string, object>>({});

	useEffect(() => {
		fetch(`${snapshots[0]}/rotation-${0}.json`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data: FeedData) => {
				setFeedData(data);
			});
	}, []);

	const Directions = () => {
		return (
			<>
				<Header>Directions</Header>
				<Body>
					Please go through each post you selected previously and rate them. You
					can rate each post by clicking the "Rate" button next to each post you
					selected.
				</Body>
				<Body>
					There is no time limit for this phase. To move forward, you have to
					rate each post you selected.
				</Body>
			</>
		);
	};

	const RateButtons = ({
		feedData,
		selectedPosts,
		setSelectedPost,
		ratings,
	}: {
		feedData: FeedData;
		selectedPosts: string[];
		selectedPost: string | null;
		setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
		ratings: Record<string, object>;
		setRatings: React.Dispatch<React.SetStateAction<Record<string, object>>>;
	}) => {
		const postInfo = feedData.filter(({ uuid }) =>
			selectedPosts.includes(uuid)
		);

		return postInfo.map(({ uuid, y, height }) => {
			if (ratings.hasOwnProperty(uuid)) {
				return (
					<div
						key={uuid}
						className="absolute"
						style={{ top: `${height / 2 + y - 20}px`, left: "492px" }}
					>
						<button
							className="py-2 px-3 shadow-lg rounded-md text-sm bg-green-500 text-white hover:bg-green-600 transition-colors"
							onClick={() => {
								setSelectedPost(uuid);
							}}
						>
							Edit
						</button>
					</div>
				);
			}

			return (
				<div
					key={uuid}
					className="absolute"
					style={{ top: `${height / 2 + y - 20}px`, left: "490px" }}
				>
					<button
						className="py-2 px-3 shadow-lg rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
						onClick={() => {
							setSelectedPost(uuid);
						}}
					>
						Rate
					</button>
				</div>
			);
		});
	};

	const RatePopup = ({
		selectedPost,
		setSelectedPost,
		setRatings,
	}: {
		selectedPost: string;
		setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
		ratings: Record<string, object>;
		setRatings: React.Dispatch<React.SetStateAction<Record<string, object>>>;
	}) => {
		const previousAnswers = ratings[selectedPost] as
			| Record<string, number | null>
			| undefined;

		const [answers, setAnswers] = useState<Record<string, number | null>>({
			"This post is relevant to me.": previousAnswers
				? previousAnswers["This post is relevant to me."]
				: null,
			"This post is trustworthy.": previousAnswers
				? previousAnswers["This post is trustworthy."]
				: null,
			"This post is high quality.": previousAnswers
				? previousAnswers["This post is high quality."]
				: null,
		});

		const isValid = () =>
			Object.values(answers).every((value) => value !== null);

		const Question = ({
			index,
			question,
		}: {
			index: number;
			question: string;
		}) => (
			<div key={index}>
				<p>{question}</p>
				<div className="flex flex-row gap-6 my-2 mx-4 items-start">
					<span>Disagree</span>
					{[1, 2, 3, 4, 5, 6, 7].map((value) => (
						<div key={value} className="flex items-center flex-col gap-2">
							<input
								type="radio"
								name={question}
								value={value}
								checked={answers[question] === value}
								onChange={() => {
									setAnswers((state) => ({
										...state,
										[question]: value,
									}));
								}}
							/>
							<label>{value}</label>
						</div>
					))}
					<span>Agree</span>
				</div>
			</div>
		);

		const PostPreview = ({ fileName }: { fileName: string }) => (
			<img
				style={{ maxHeight: "300px", display: "block" }}
				src={fileName}
				className="my-4 mx-auto border-2"
			/>
		);

		const SubmitButton = () => (
			<button
				className={
					"mt-4 py-2 px-4 " +
					(isValid()
						? "bg-blue-400 rounded hover:bg-blue-500"
						: "bg-gray-200 rounded cursor-not-allowed")
				}
				onClick={() => {
					setRatings((state) => ({
						...state,
						[selectedPost]: {
							...answers,
							timestamp: new Date().toISOString(),
						},
					}));
					setSelectedPost(null);
				}}
				disabled={!isValid()}
			>
				Submit
			</button>
		);

		const CloseButton = () => (
			<button
				className="mt-4 py-2 px-4 bg-red-400 rounded hover:bg-red-500"
				onClick={() => setSelectedPost(null)}
			>
				Close
			</button>
		);

		return (
			<>
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.5)",
						zIndex: 100,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						direction: "ltr",
					}}
				>
					<div
						style={{
							background: "white",
							padding: "2rem",
							borderRadius: "8px",
							boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
							zIndex: 1_000,
							width: "600px",
							textAlign: "left",
						}}
					>
						<Header>Selected Post</Header>
						<Body>
							We see that you selected this post from the feed and wanted to
							understand what you think about the post based on its preview.
						</Body>
						<PostPreview fileName={`${snapshots[0]}/${selectedPost}.png`} />
						<div>
							{QUESTIONS.map((question, index) => (
								<Question key={index} index={index} question={question} />
							))}
						</div>
						<div className="flex flex-row gap-2">
							<SubmitButton />
							<CloseButton />
						</div>
					</div>
				</div>
			</>
		);
	};

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px]">
				<div className="flex flex-col gap-2 mb-4">
					<Directions />
					<Body>
						<b className="text-black">Posts Rated:</b>{" "}
						{Object.keys(ratings).length} /{" "}
						{(data as { selectedPosts: string[] }).selectedPosts.length}
					</Body>
					<button
						className={
							"py-2 px-3 mt-4 shadow-lg rounded-md text-[10pt] bg-blue-500 text-white hover:bg-blue-600 transition-colors" +
							(Object.keys(ratings).length <
							(data as { selectedPosts: string[] }).selectedPosts.length
								? " opacity-50 cursor-not-allowed"
								: "")
						}
						onClick={() => {
							setData((state: object) => ({
								...state,
								ratings: ratings,
							}));
							setPhase("end");
						}}
						disabled={
							Object.keys(ratings).length <
							(data as { selectedPosts: string[] }).selectedPosts.length
						}
					>
						Continue
					</button>
				</div>

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
					<RateButtons
						feedData={feedData}
						selectedPosts={(data as { selectedPosts: string[] }).selectedPosts}
						selectedPost={selectedPost}
						setSelectedPost={setSelectedPost}
						ratings={ratings}
						setRatings={setRatings}
					/>
					{selectedPost && (
						<RatePopup
							selectedPost={selectedPost}
							setSelectedPost={setSelectedPost}
							ratings={ratings}
							setRatings={setRatings}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

function App() {
	const [data, setData] = useState<object>({});
	const [phase, setPhase] = useState("start");
	const [participantID, setParticipantID] = useState<string | null>(null);
	const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);

	return (
		<SurveyContext.Provider
			value={{
				data,
				setData,
				phase,
				setPhase,
				participantID,
				setParticipantID,
				consentTimestamp,
				setConsentTimestamp,
			}}
		>
			{phase === "start" && <Intro />}
			{phase === "feed" && <Feed />}
			{phase === "rate" && <FeedRate />}
			{phase === "end" && <Goodbye />}
		</SurveyContext.Provider>
	);
}

export default App;
