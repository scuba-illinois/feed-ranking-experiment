import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { FeedData, QuestionAnswers } from "../types";
import { Body, Header } from "../components/general";
import { FeedView } from "./FeedSelect";

const Directions = () => {
	return (
		<div className="flex flex-col gap-2 mb-2">
			<Header>Directions</Header>
			<Body>
				Please go through each post you selected previously and rate them. You
				can rate each post by clicking the "Rate" button next to each post you
				selected.
			</Body>
			<Body>
				There is no time limit for this phase. To move forward, you have to rate
				each post you selected.
			</Body>
		</div>
	);
};

const Status = ({
	ratings,
}: {
	ratings: Record<
		string,
		{
			"This post is relevant to me": number;
			"This post is interesting": number;
			"This post is informative": number;
		}
	>;
}) => {
	const { answers, feeds } = useContext(SurveyContext);

	const selectedPosts = answers[feeds[0]]?.selectedPosts || [];

	return (
		<Body>
			<b className="text-black">Posts Rated: </b>{" "}
			{Object.keys(ratings).length.toLocaleString()} /{" "}
			{selectedPosts.length.toLocaleString()}
		</Body>
	);
};

const ContinueButton = ({
	ratings,
}: {
	ratings: Record<string, QuestionAnswers>;
}) => {
	const { setPhase, answers, setAnswers, feeds } = useContext(SurveyContext);

	const numSelected = answers[feeds[0]]?.selectedPosts?.length || 0;

	const disabled = Object.keys(ratings).length !== numSelected;

	return (
		<button
			className={
				"px-3 py-2 my-4 shadow-lg rounded-md text-[10pt] text-white bg-blue-500 hover:bg-blue-600 transition-colors " +
				(disabled ? "opacity-50 cursor-not-allowed" : "")
			}
			onClick={() => {
				setAnswers((state) => ({
					...state,
					[feeds[0]]: {
						...state[feeds[0]],
						ratings: ratings,
					},
				}));

				// TODO: Implement exit questionnaire phase.
				setPhase("GOODBYE");
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
}: {
	feedData: FeedData;
	ratings: Record<string, QuestionAnswers>;
	setRatings: React.Dispatch<
		React.SetStateAction<Record<string, QuestionAnswers>>
	>;
	setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
	const { answers, feeds } = useContext(SurveyContext);

	const selectedPostData = feedData.filter((post) =>
		answers[feeds[0]].selectedPosts?.includes(post.uuid)
	);

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
						className="py-2 px-3 shadow-lg rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors"
						onClick={() => setSelectedPost(uuid)}
					>
						{label}
					</button>
				)}
				{color === "green" && (
					<button
						className="py-2 px-3 shadow-lg rounded-md text-sm text-white bg-green-500 hover:bg-green-600 transition-colors"
						onClick={() => setSelectedPost(uuid)}
					>
						{label}
					</button>
				)}
			</div>
		);
	};

	return selectedPostData.map(({ uuid, y, height }) => {
		// Check if the post has already been rated. If so, render an edit button.
		if (ratings.hasOwnProperty(uuid)) {
			return (
				<Button
					key={uuid}
					uuid={uuid}
					color="green"
					label="Edit"
					top={height / 2 + y - 20}
					left={492}
				/>
			);
		}

		// If the post has not been rated yet, render a rate button.
		return (
			<Button
				key={uuid}
				uuid={uuid}
				color="blue"
				label="Rate"
				top={height / 2 + y - 20}
				left={490}
			/>
		);
	});
};

const RatingPopup = ({
	selectedPost,
	setSelectedPost,
	ratings,
	setRatings,
}: {
	selectedPost: string;
	setSelectedPost: React.Dispatch<React.SetStateAction<string | null>>;
	ratings: Record<string, QuestionAnswers>;
	setRatings: React.Dispatch<
		React.SetStateAction<Record<string, QuestionAnswers>>
	>;
}) => {
	const { feeds } = useContext(SurveyContext);

	const previousAnswers = ratings[selectedPost];

	const [answers, setAnswers] = useState<QuestionAnswers>({
		"This post is relevant to me":
			previousAnswers?.["This post is relevant to me"] || 0,
		"This post is interesting":
			previousAnswers?.["This post is interesting"] || 0,
		"This post is informative":
			previousAnswers?.["This post is informative"] || 0,
	});

	const isValid = () => Object.values(answers).every((value) => value > 0);

	const Question = ({ question }: { question: keyof QuestionAnswers }) => (
		<div>
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
							onChange={() =>
								setAnswers((state) => ({
									...state,
									[question]: value,
								}))
							}
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
			src={fileName}
			style={{ maxHeight: "300px", display: "block" }}
			className="my-4 mx-auto border-2"
		/>
	);

	const SubmitButton = () => (
		<button
			className={
				"mt-4 py-2 px-4 rounded " +
				(isValid()
					? "bg-blue-400 hover:bg-blue-500"
					: "bg-gray-200 cursor-not-allowed")
			}
			disabled={!isValid()}
			onClick={() => {
				setRatings((state) => ({
					...state,
					[selectedPost]: { ...answers },
				}));
				setSelectedPost(null);
			}}
		>
			Submit
		</button>
	);

	const CloseButton = () => (
		<button
			className="rounded mt-4 py-2 px-4 bg-red-400 hover:bg-red-500"
			onClick={() => setSelectedPost(null)}
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
					width: "600px",
					textAlign: "left",
				}}
			>
				<Header>Selected Post</Header>
				<Body>
					We see that you selected this post from the feed and wanted to
					understand what you think about the post based on its preview.
				</Body>
				<PostPreview fileName={`${feeds[0]}/${selectedPost}.png`} />
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
	// @ts-ignore
	const { feeds, rotations, setPhase } = useContext(SurveyContext);
	const [feedData, setFeedData] = useState<FeedData | null>(null);

	// Local rating state, once all questions are answered, it will be saved to the context.
	const [_ratings, _setRatings] = useState<Record<string, QuestionAnswers>>({});

	// Used to track which post is being rated.
	const [_selectedPost, _setSelectedPost] = useState<string | null>(null);

	const fileName = `${feeds[0]}/rotation-${rotations[0]}.png`;

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

	if (!feedData) {
		return <Header>Loading Feed...</Header>;
	}

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px]">
				<Directions />
				<Status ratings={_ratings} />
				<ContinueButton ratings={_ratings} />
				<div
					className="overflow-y-scroll relative w-[650px] grid justify-items-end pl-4"
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
					/>
					{_selectedPost && (
						<RatingPopup
							selectedPost={_selectedPost}
							setSelectedPost={_setSelectedPost}
							ratings={_ratings}
							setRatings={_setRatings}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
