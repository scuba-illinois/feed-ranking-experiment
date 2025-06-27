import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { FeedData, QuestionAnswers, RatingLogs } from "../types";
import { Body, Header } from "../components/general";
import { FeedView } from "./FeedSelect";
import { pickRandomItems } from "../utils";

const NUM_NON_SELECTED = 3;

const QUESTION_WORDINGS = {
	quality: "This post seems well-made and high quality.",
	relevance: "This post feels personally relevant to me.",
	manipulation:
		"This post seems exaggerated or misleading to attract attention.",
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
				You'll now rate posts from the previous feed. The "Rate" button next to
				each post will allow you to evaluate a post's relevance, quality, and
				manipulativeness.
			</Body>

			<Body>
				Posts that you selected in the previous step will be marked with a star
				icon (⭐️) near the top-right corner.
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
					left={ratings.hasOwnProperty(uuid) ? 482 + 20 : 480 + 20}
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
	const { feeds, completedFeeds, postURLs } = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const previousAnswers = ratings[selectedPost];

	const [answers, setAnswers] = useState<QuestionAnswers>({
		relevance: previousAnswers?.relevance || 0,
		quality: previousAnswers?.quality || 0,
		manipulation: previousAnswers?.manipulation || 0,
	});

	const isValid = () => Object.values(answers).every((value) => value > 0);

	const Question = ({ question }: { question: keyof QuestionAnswers }) => (
		<div>
			<Body>{QUESTION_WORDINGS[question]}</Body>
			<div className="flex flex-row mt-4 mb-2 mx-4 items-start w-full justify-center">
				<Body className="mr-2">Strongly Disagree</Body>
				{[1, 2, 3, 4, 5].map((value) => (
					<label
						key={value}
						className="flex flex-col items-center gap-2 px-4 cursor-pointer"
					>
						<input
							className="cursor-pointer"
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
					</label>
				))}
				<Body className="ml-2">Strongly Agree</Body>
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
			className="rounded mt-4 py-2 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
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
						this post. Please rate this post's relevance, quality, and
						manipulativeness based on the preview.
					</Body>
				</>
				<PostPreview fileName={postURLs[feedUUID][selectedPost]} />
				<div>
					{(Object.keys(answers) as Array<keyof QuestionAnswers>).map(
						(question) => (
							<Question key={question} question={question} />
						)
					)}
				</div>
				<div className="flex flex-row gap-2 justify-between">
					<SubmitButton />
					<CloseButton />
				</div>
			</div>
		</div>
	);
};

export const FeedRate = () => {
	const { feeds, feedURLs, feedData, completedFeeds, answers } =
		useContext(SurveyContext);

	// Figure out which feed and rotation we are currently on.
	const feedUUID = feeds[completedFeeds.length];
	const fileName = feedURLs[completedFeeds.length];

	// Local rating state, once all questions are answered, it will be saved to the context.
	const [_ratings, _setRatings] = useState<Record<string, QuestionAnswers>>({});
	const [_logs, _setLogs] = useState<RatingLogs>([]);

	// Used to track which post is being rated.
	const [_selectedPost, _setSelectedPost] = useState<string | null>(null);

	return (
		<div className="flex justify-center h-[100vh] gap-2 py-4">
			<div className="flex flex-col w-[560px]">
				<Directions />
				<Status ratings={_ratings} />
				<ContinueButton ratings={_ratings} logs={_logs} />
				<div
					className="overflow-y-scroll relative w-[600px] grid justify-items-end pl-6"
					style={{ direction: "rtl" }}
				>
					<FeedView
						fileName={fileName}
						height={feedData[feedUUID][9].y + feedData[feedUUID][9].height}
					/>
					<RateButtons
						feedData={feedData[feedUUID] as FeedData}
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
					{feedData[feedUUID] &&
						feedData[feedUUID]
							.filter(({ uuid }) =>
								answers[feedUUID]!.selectedPosts!.includes(uuid)
							)
							.map(({ uuid, y }) => {
								return (
									<span
										key={uuid}
										style={{ top: y + 5, left: 520 + 20 }}
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
