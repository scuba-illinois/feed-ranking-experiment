import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Answers, FeedData, QuestionAnswers, RatingLogs } from "../types";
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

const ToggleDirectionsButton = () => {
	const { settings, setSettings } = useContext(SurveyContext);

	const toggleDirections = () => {
		setSettings((state) => ({
			...state,
			hideRatingDirections: !state.hideRatingDirections,
		}));
	};

	return settings.hideRatingDirections ? (
		<button
			onClick={toggleDirections}
			className="text-[10pt] rounded py-1 px-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
		>
			Show Directions
		</button>
	) : (
		<button
			onClick={toggleDirections}
			className="text-[10pt] rounded py-1 px-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
		>
			Hide Directions
		</button>
	);
};

const Directions = () => {
	const { feeds, completedFeeds, settings } = useContext(SurveyContext);

	return (
		<div className="flex flex-col gap-2 mb-2">
			<div className="flex flex-row justify-between items-center">
				<Header>
					Feed {(completedFeeds.length + 1).toLocaleString()} /{" "}
					{feeds.length.toLocaleString()} - Rating Phase
				</Header>
				<ToggleDirectionsButton />
			</div>
			{!settings.hideRatingDirections && (
				<>
					<Body>
						<span className="font-bold">Directions:</span> You'll now rate posts
						from the previous feed—
						<span className="italic">
							specifically the ones you selected and a few posts you did not
							select.
						</span>{" "}
						Use the "Rate" button next to each post to evaluate its relevance,
						quality, and manipulativeness.
					</Body>

					<Body>
						Posts you selected in the previous step are marked with a star icon
						(⭐️) in the top-right corner.
					</Body>

					<Body>
						There's no time limit. You must rate every post to continue.
					</Body>
				</>
			)}
		</div>
	);
};

const Status = ({ ratings }: { ratings: Record<string, QuestionAnswers> }) => {
	const { answers, feeds, completedFeeds } = useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const selectedPosts = answers[feedUUID]?.selectedPosts || [];
	const nonSelectedPosts = answers[feedUUID]?.nonSelectedPosts || [];

	const attentionCheckAnswers = answers[feedUUID]?.attentionCheckAnswer;

	const containsAttentionCheck =
		answers[feedUUID].attentionCheckPost !== undefined;

	const completedAttentionCheck =
		attentionCheckAnswers !== undefined &&
		attentionCheckAnswers.relevance !== 0 &&
		attentionCheckAnswers.quality !== 0 &&
		attentionCheckAnswers.manipulation !== 0;

	return (
		<span className="text-[10pt] text-gray-600">
			<b className="text-black">Posts Rated: </b>{" "}
			{(
				Object.keys(ratings).length + (completedAttentionCheck ? 1 : 0)
			).toLocaleString()}{" "}
			/{" "}
			{(
				selectedPosts.length +
				nonSelectedPosts.length +
				(containsAttentionCheck ? 1 : 0)
			).toLocaleString()}
		</span>
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

	const attentionCheckAnswers = answers[feedUUID]?.attentionCheckAnswer;

	const containsAttentionCheck =
		answers[feedUUID].attentionCheckPost !== undefined;

	const completedAttentionCheck =
		attentionCheckAnswers !== undefined &&
		attentionCheckAnswers.relevance !== 0 &&
		attentionCheckAnswers.quality !== 0 &&
		attentionCheckAnswers.manipulation !== 0;

	const disabled =
		Object.keys(ratings).length + (completedAttentionCheck ? 1 : 0) !==
		numSelected + numNonSelected + (containsAttentionCheck ? 1 : 0);

	return (
		<button
			className={
				"px-3 py-2 my-4 rounded-md shadow-lg text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors " +
				(disabled ? "opacity-50 cursor-not-allowed" : "")
			}
			onClick={() => {
				const ratingEnd = new Date();

				setAnswers((state) => ({
					...state,
					[feedUUID]: {
						...state[feedUUID],
						ratingEnd: ratingEnd.toISOString(),
						ratingDuration:
							(ratingEnd.getTime() -
								new Date(state[feedUUID].ratingStart).getTime()) /
							1_000,
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
	setSelectedPost: React.Dispatch<
		React.SetStateAction<{ uuid: string; isAttentionCheck: boolean } | null>
	>;
	setLogs: React.Dispatch<React.SetStateAction<RatingLogs>>;
}) => {
	const { answers, setAnswers, feeds, completedFeeds } =
		useContext(SurveyContext);

	const feedUUID = feeds[completedFeeds.length];

	const selectedPostData = feedData
		.filter((post) => answers[feedUUID].selectedPosts?.includes(post.uuid))
		.map((data) => ({ ...data, isAttentionCheck: false }));
	const nonSelectedPosts = answers[feedUUID].nonSelectedPosts || [];
	const nonSelectedPostsData = feedData
		.filter(({ uuid }) => nonSelectedPosts.includes(uuid))
		.map((data) => ({ ...data, isAttentionCheck: false }));

	const attentionCheckPost = answers[feedUUID].attentionCheckPost ?? "";
	const attentionCheckPostData = feedData
		.filter(({ uuid }) => attentionCheckPost === uuid)
		.map((data) => ({ ...data, isAttentionCheck: true }));

	useEffect(() => {
		// For this feed, get all the non-selected posts.
		const allNonSelectedPosts = feedData
			.filter(({ uuid }) => !answers[feedUUID].selectedPosts?.includes(uuid))
			.map(({ uuid }) => uuid);

		// Pick 3 random non-selected posts.
		const nonSelectedPosts = pickRandomItems(
			allNonSelectedPosts,
			NUM_NON_SELECTED + 1 // Plus one for potential attention check post.
		);

		setAnswers((state) => ({
			...state,
			[feedUUID]: {
				...state[feedUUID],
				nonSelectedPosts: nonSelectedPosts.slice(0, NUM_NON_SELECTED),
				...(completedFeeds.length === 1
					? {
							attentionCheckPost: nonSelectedPosts[nonSelectedPosts.length - 1],
							attentionCheckAnswer: {
								relevance: 0,
								quality: 0,
								manipulation: 0,
							},
					  }
					: {}),
			},
		}));
	}, []);

	const Button = ({
		uuid,
		color,
		label,
		top,
		left,
		isAttentionCheck,
	}: {
		uuid: string;
		color: "blue" | "green";
		label: string;
		top: number;
		left: number;
		isAttentionCheck: boolean;
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
							setSelectedPost({
								uuid,
								isAttentionCheck,
							});
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
							setSelectedPost({
								uuid,
								isAttentionCheck,
							});
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

	return [
		...selectedPostData,
		...nonSelectedPostsData,
		...attentionCheckPostData,
	].map(({ uuid, y, height, isAttentionCheck }) => {
		return (
			<Button
				key={uuid}
				uuid={uuid}
				isAttentionCheck={isAttentionCheck}
				color={
					ratings.hasOwnProperty(uuid) ||
					(isAttentionCheck &&
						answers[feedUUID]?.attentionCheckAnswer?.relevance !== 0 &&
						answers[feedUUID]?.attentionCheckAnswer?.quality !== 0 &&
						answers[feedUUID]?.attentionCheckAnswer?.manipulation !== 0)
						? "green"
						: "blue"
				}
				label={
					ratings.hasOwnProperty(uuid) ||
					(isAttentionCheck &&
						answers[feedUUID]?.attentionCheckAnswer?.relevance !== 0 &&
						answers[feedUUID]?.attentionCheckAnswer?.quality !== 0 &&
						answers[feedUUID]?.attentionCheckAnswer?.manipulation !== 0)
						? "Edit"
						: "Rate"
				}
				top={height / 2 + y - 20}
				left={ratings.hasOwnProperty(uuid) ? 482 + 20 : 480 + 20}
			/>
		);
	});
};

const RatingPopup = ({
	selectedPost,
	setSelectedPost,
	ratings,
	setRatings,
	setLogs,
	selected,
}: {
	selectedPost: { uuid: string; isAttentionCheck: boolean } | null;
	setSelectedPost: React.Dispatch<
		React.SetStateAction<{ uuid: string; isAttentionCheck: boolean } | null>
	>;
	ratings: Record<string, QuestionAnswers>;
	setRatings: React.Dispatch<
		React.SetStateAction<Record<string, QuestionAnswers>>
	>;
	setLogs: React.Dispatch<React.SetStateAction<RatingLogs>>;
	selected: boolean;
}) => {
	const { feeds, completedFeeds, postURLs, optionOrder, answers, setAnswers } =
		useContext(SurveyContext);

	// FIXME: Crappy patch because the names from the server for
	// perceptions dimensions are different.
	const order = optionOrder.likert.map((option) => {
		if (option === "content_quality") {
			return "quality";
		} else if (option === "relevance") {
			return "relevance";
		} else if (option === "trustworthiness") {
			return "manipulation";
		}
	});

	const isAttentionCheck = selectedPost?.isAttentionCheck ?? false;

	const feedUUID = feeds[completedFeeds.length];

	const previousAnswers = selectedPost?.isAttentionCheck
		? answers[feedUUID]!.attentionCheckAnswer
		: ratings[selectedPost!.uuid];

	const [popupRatings, setPopupRatings] = useState<QuestionAnswers>({
		relevance: previousAnswers?.relevance || 0,
		quality: previousAnswers?.quality || 0,
		manipulation: previousAnswers?.manipulation || 0,
	});

	const isValid = () => Object.values(popupRatings).every((value) => value > 0);

	const Question = ({
		question,
		attentionCheck,
	}: {
		question: keyof QuestionAnswers;
		attentionCheck: boolean;
	}) => (
		<div>
			<span className="text-[10pt] text-gray-700">
				{!attentionCheck
					? QUESTION_WORDINGS[question]
					: "Please select 2 on the scale below."}
			</span>
			<div className="flex flex-row mt-4 mb-2 mx-4 items-start w-full justify-center">
				<span className="text-[10pt] text-gray-600 mr-2">
					Strongly Disagree
				</span>
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
							checked={popupRatings[question] === value}
							onChange={() => {
								setPopupRatings((state) => ({
									...state,
									[question]: value,
								}));

								setLogs((state) => [
									...state,
									{
										timestamp: new Date().toISOString(),
										action: "RATE",
										uuid: selectedPost!.uuid,
										question: question,
										rating: value,
									},
								]);
							}}
						/>
						<span className="text-[10pt] text-gray-600">{value}</span>
					</label>
				))}
				<span className="text-[10pt] text-gray-600 ml-2">Strongly Agree</span>
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

	const SubmitButton = ({
		isAttentionCheck,
		setAnswers,
	}: {
		isAttentionCheck: boolean;
		setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
	}) => {
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
					if (!isAttentionCheck) {
						setRatings((state) => ({
							...state,
							[selectedPost!.uuid]: { ...popupRatings },
						}));
					} else {
						setAnswers((state) => ({
							...state,
							[feedUUID]: {
								...state[feedUUID],
								attentionCheckAnswer: { ...popupRatings },
							},
						}));
					}
					setSelectedPost(null);
					setLogs((state) => [
						...state,
						{
							timestamp: new Date().toISOString(),
							action: "SUBMIT",
							uuid: selectedPost!.uuid,
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
						uuid: selectedPost!.uuid,
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
					<Header>Rate This Post</Header>
					{!isAttentionCheck && (
						<span className="text-[10pt] text-gray-600">
							{selected ? (
								"You selected"
							) : (
								<>
									You did <i>not</i> select
								</>
							)}{" "}
							this post. Please rate this post's relevance, quality, and
							manipulativeness based on the preview.
						</span>
					)}
					{isAttentionCheck && (
						<span className="text-[10pt] text-gray-600">
							This is an attention check. Please select 2 on all scales below.
						</span>
					)}
				</>
				<PostPreview fileName={postURLs[feedUUID][selectedPost!.uuid]} />
				<div>
					{(order as Array<keyof QuestionAnswers>).map(
						(question: "quality" | "relevance" | "manipulation") => (
							<Question
								key={question}
								question={question}
								attentionCheck={selectedPost!.isAttentionCheck}
							/>
						)
					)}
				</div>
				<div className="flex flex-row gap-2 justify-between">
					<CloseButton />
					<SubmitButton
						isAttentionCheck={isAttentionCheck}
						setAnswers={setAnswers}
					/>
				</div>
			</div>
		</div>
	);
};

export const FeedRate = () => {
	const { feeds, feedURLs, feedData, completedFeeds, answers, setAnswers } =
		useContext(SurveyContext);

	// Figure out which feed and rotation we are currently on.
	const feedUUID = feeds[completedFeeds.length];
	const fileName = feedURLs[completedFeeds.length];

	// Local rating state, once all questions are answered, it will be saved to the context.
	const [_ratings, _setRatings] = useState<Record<string, QuestionAnswers>>({});
	const [_logs, _setLogs] = useState<RatingLogs>([]);

	// Used to track which post is being rated.
	const [_selectedPost, _setSelectedPost] = useState<{
		uuid: string;
		isAttentionCheck: boolean;
	} | null>(null);

	useEffect(() => {
		setAnswers((state) => ({
			...state,
			[feedUUID]: {
				...state[feedUUID],
				ratingStart: new Date().toISOString(),
			},
		}));
	}, []);

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
								_selectedPost!.uuid
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
