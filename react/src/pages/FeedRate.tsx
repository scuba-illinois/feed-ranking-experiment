import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { FeedData, QuestionAnswers, RatingLogs } from "../types";
import { Body, Header } from "../components/general";
import { FeedView } from "./FeedSelect";
import { pickRandomItems } from "../utils";

const NUM_NON_SELECTED = 3;

const QuestionWordings = {
	quality: "This post is of high quality.",
	relevance: "This post is relevant to me.",
	trust: "This post is trustworthy.",
};

const Directions = () => {
	const { feeds, completedFeeds } = useContext(SurveyContext);

	return (
		<div className="flex flex-col gap-2 mb-2">
			<Header>
				Directions (Feed {(completedFeeds.length + 1).toLocaleString()} /{" "}
				{feeds.length.toLocaleString()})
			</Header>
			<Body>
				Click the "Rate" button next to each post to evaluate its relevance,
				trustworthiness, and content quality. A popup will appear for each
				rating.
			</Body>

			<Body>
				Posts that you selected in the previous step will be marked with a star
				icon (⭐️) near the top right corner of each selected post.
			</Body>
			<Body>There's no time limit. You must rate every post to continue.</Body>
		</div>
	);
};

const Status = ({ ratings }: { ratings: Record<string, QuestionAnswers> }) => {
	const { answers, feeds, completedFeeds } = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const selectedPosts = answers[feedUUID]?.selectedPosts || [];
	const nonSelectedPosts = answers[feedUUID]?.nonSelectedPosts || [];

	return (
		<Body>
			<b className="text-black">Posts Rated: </b>{" "}
			{Object.keys(ratings).length.toLocaleString()} /{" "}
			{(selectedPosts.length + nonSelectedPosts.length).toLocaleString()}
		</Body>
	);
};

const ContinueButton = ({
	ratings,
	logs,
}: {
	ratings: Record<string, QuestionAnswers>;
	logs: RatingLogs;
}) => {
	const {
		setPhase,
		answers,
		setAnswers,
		feeds,
		completedFeeds,
		setCompletedFeeds,
	} = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const numSelected = answers[feedUUID]?.selectedPosts?.length || 0;
	const numNonSelected = answers[feedUUID]?.nonSelectedPosts?.length || 0;

	const disabled = Object.keys(ratings).length !== numSelected + numNonSelected;

	return (
		<button
			className={
				"px-3 py-2 my-4 rounded-md shadow-lg text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors " +
				(disabled ? "opacity-50 cursor-not-allowed" : "")
			}
			onClick={() => {
				setAnswers((state) => ({
					...state,
					[feedUUID]: {
						...state[feedUUID],
						ratings: ratings,
						ratingLogs: [
							...logs,
							{
								timestamp: new Date().toISOString(),
								action: "END",
							},
						],
					},
				}));

				// Add the feed UUID to the completed list of feeds.
				setCompletedFeeds((state) => [...state, feedUUID]);

				// If there are no more feeds to rate, conclude the survey.
				if (feeds.length !== completedFeeds.length + 1) {
					setPhase("FEED");
				} else {
					setPhase("EXIT");
				}
			}}
			disabled={disabled}
		>
			Continue
		</button>
	);
};

const RateButtons = ({
	feedData,
	ratings,
	setSelectedPost,
	setLogs,
}: {
	feedData: FeedData;
	ratings: Record<string, QuestionAnswers>;
	setRatings: React.Dispatch<
		React.SetStateAction<Record<string, QuestionAnswers>>
	>;
	setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
	setLogs: React.Dispatch<React.SetStateAction<RatingLogs>>;
}) => {
	const { answers, setAnswers, feeds, completedFeeds } =
		useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const selectedPostData = feedData.filter((post) =>
		answers[feedUUID].selectedPosts?.includes(post.uuid)
	);
	const nonSelectedPosts = answers[feedUUID].nonSelectedPosts || [];
	const nonSelectedPostsData = feedData.filter(({ uuid }) =>
		nonSelectedPosts.includes(uuid)
	);

	useEffect(() => {
		const allNonSelectedPosts = feedData
			.filter(({ uuid }) => !answers[feedUUID].selectedPosts?.includes(uuid))
			.map(({ uuid }) => uuid);

		const nonSelectedPosts = pickRandomItems(
			allNonSelectedPosts,
			NUM_NON_SELECTED
		);

		setAnswers((state) => ({
			...state,
			[feedUUID]: {
				...state[feedUUID],
				nonSelectedPosts: nonSelectedPosts,
			},
		}));
	}, []);

	const Button = ({
		uuid,
		color,
		label,
		top,
		left,
	}: {
		uuid: string;
		color: "blue" | "green";
		label: string;
		top: number;
		left: number;
	}) => {
		return (
			<div
				className="absolute"
				style={{
					top: `${top}px`,
					left: `${left}px`,
				}}
			>
				{color === "blue" && (
					<button
						className="py-2 px-3 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors"
						onClick={() => {
							setSelectedPost(uuid);
							setLogs((state) => [
								...state,
								{
									timestamp: new Date().toISOString(),
									action: "OPEN",
									uuid: uuid,
								},
							]);
						}}
					>
						{label}
					</button>
				)}
				{color === "green" && (
					<button
						className="py-2 px-3 rounded-md text-sm text-white bg-green-500 hover:bg-green-600 transition-colors"
						onClick={() => {
							setSelectedPost(uuid);
							setLogs((state) => [
								...state,
								{
									timestamp: new Date().toISOString(),
									action: "EDIT",
									uuid: uuid,
								},
							]);
						}}
					>
						{label}
					</button>
				)}
			</div>
		);
	};

	return [...selectedPostData, ...nonSelectedPostsData].map(
		({ uuid, y, height }) => {
			return (
				<Button
					key={uuid}
					uuid={uuid}
					color={ratings.hasOwnProperty(uuid) ? "green" : "blue"}
					label={ratings.hasOwnProperty(uuid) ? "Edit" : "Rate"}
					top={height / 2 + y - 20}
					left={ratings.hasOwnProperty(uuid) ? 482 : 480}
				/>
			);
		}
	);
};

const RatingPopup = ({
	selectedPost,
	setSelectedPost,
	ratings,
	setRatings,
	setLogs,
	selected,
}: {
	selectedPost: string;
	setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
	ratings: Record<string, QuestionAnswers>;
	setRatings: React.Dispatch<
		React.SetStateAction<Record<string, QuestionAnswers>>
	>;
	setLogs: React.Dispatch<React.SetStateAction<RatingLogs>>;
	selected: boolean;
}) => {
	const { feeds, completedFeeds } = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const previousAnswers = ratings[selectedPost];

	const [answers, setAnswers] = useState<QuestionAnswers>({
		relevance: previousAnswers?.relevance || 0,
		trust: previousAnswers?.trust || 0,
		quality: previousAnswers?.quality || 0,
	});

	const isValid = () => Object.values(answers).every((value) => value > 0);

	const Question = ({ question }: { question: keyof QuestionAnswers }) => (
		<div>
			<Body>{QuestionWordings[question]}</Body>
			<div className="flex flex-row gap-6 mt-4 mb-2 mx-4 items-start w-full justify-center">
				<Body>Disagree</Body>
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
								setLogs((state) => [
									...state,
									{
										timestamp: new Date().toISOString(),
										action: "RATE",
										uuid: selectedPost,
										question: question,
										rating: value,
									},
								]);
							}}
						/>
						<Body>{value}</Body>
					</div>
				))}
				<Body>Agree</Body>
			</div>
		</div>
	);

	const PostPreview = ({ fileName }: { fileName: string }) => (
		<img
			src={fileName}
			style={{ maxHeight: "300px", display: "block" }}
			className="my-4 mx-auto border-2"
		/>
	);

	const SubmitButton = () => {
		return (
			<button
				className={
					"mt-4 py-2 px-4 rounded text-white " +
					(isValid()
						? "bg-blue-500 hover:bg-blue-600"
						: "bg-gray-200 cursor-not-allowed")
				}
				disabled={!isValid()}
				onClick={() => {
					setRatings((state) => ({
						...state,
						[selectedPost]: { ...answers },
					}));
					setSelectedPost(null);
					setLogs((state) => [
						...state,
						{
							timestamp: new Date().toISOString(),
							action: "SUBMIT",
							uuid: selectedPost,
						},
					]);
				}}
			>
				Submit
			</button>
		);
	};

	const CloseButton = () => (
		<button
			className="rounded text-white mt-4 py-2 px-4 bg-red-500 hover:bg-red-600"
			onClick={() => {
				setSelectedPost(null);
				setLogs((state) => [
					...state,
					{
						timestamp: new Date().toISOString(),
						action: "CLOSE",
						uuid: selectedPost,
					},
				]);
			}}
		>
			Close
		</button>
	);

	return (
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
					width: "580px",
					textAlign: "left",
				}}
			>
				<>
					<Header className="mb-2">Rate This Post</Header>
					<Body>
						{selected ? (
							"You selected"
						) : (
							<>
								You did <i>not</i> select
							</>
						)}{" "}
						this post. Please rate its relevance, trustworthiness, and content
						quality based on the preview.
					</Body>
				</>

				<PostPreview fileName={`${feedUUID}/${selectedPost}.png`} />
				<div>
					{(Object.keys(answers) as Array<keyof QuestionAnswers>).map(
						(question) => (
							<Question key={question} question={question} />
						)
					)}
				</div>
				<div className="flex flex-row gap-2">
					<SubmitButton />
					<CloseButton />
				</div>
			</div>
		</div>
	);
};

export const FeedRate = () => {
	const { feeds, rotations, completedFeeds, answers } =
		useContext(SurveyContext);

	// Figure out which feed and rotation we are currently on.
	const feedUUID = feeds[completedFeeds.length];
	const rotation = rotations[completedFeeds.length];

	// Used for the boundaries of the post.
	const [feedData, setFeedData] = useState<FeedData | null>(null);

	// Local rating state, once all questions are answered, it will be saved to the context.
	const [_ratings, _setRatings] = useState<Record<string, QuestionAnswers>>({});
	const [_logs, _setLogs] = useState<RatingLogs>([]);

	// Used to track which post is being rated.
	const [_selectedPost, _setSelectedPost] = useState<string | null>(null);

	const fileName = `${feedUUID}/rotation-${rotation}.png`;

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

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 py-4">
			<div className="flex flex-col w-[560px]">
				<Directions />
				<Status ratings={_ratings} />
				<ContinueButton ratings={_ratings} logs={_logs} />
				<div
					className="overflow-y-scroll relative w-[650px] grid justify-items-end pl-1"
					style={{ direction: "rtl" }}
				>
					<FeedView
						fileName={fileName}
						height={feedData[9].y + feedData[9].height}
					/>
					<RateButtons
						feedData={feedData}
						ratings={_ratings}
						setRatings={_setRatings}
						setSelectedPost={_setSelectedPost}
						setLogs={_setLogs}
					/>
					{_selectedPost && (
						<RatingPopup
							selectedPost={_selectedPost}
							setSelectedPost={_setSelectedPost}
							ratings={_ratings}
							setRatings={_setRatings}
							setLogs={_setLogs}
							selected={answers[feedUUID]!.selectedPosts!.includes(
								_selectedPost
							)} // FIXME: Terrible ! usage.
						/>
					)}

					{/* Some marker for selected posts. */}
					{feedData &&
						feedData
							.filter(({ uuid }) =>
								answers[feedUUID]!.selectedPosts!.includes(uuid)
							)
							.map(({ uuid, y }) => {
								return (
									<span
										key={uuid}
										style={{ top: y + 5, left: 520 }}
										className="absolute text-3xl"
									>
										⭐️
									</span>
								);
							})}
				</div>
			</div>
		</div>
	);
};
