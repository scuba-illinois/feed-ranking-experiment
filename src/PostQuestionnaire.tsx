import { useContext, useEffect, useState } from "react";
import { PhaseContext, SurveyContext } from "./App";
import { Actions, likertOptions, likertQuestions, Post, Survey } from "./types";
import chance from "chance";

function HorizontalLine() {
	return <hr className="my-2 border-gray-300" />;
}

// TODO: Could be more strict about the likert types instead of string, string.
type Response = {
	actions: string[];
	likert: Record<string, string>;
	overallQuality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
};

function valid(responses: {
	actions: string[];
	likert: Record<string, string>;
	overallQuality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
}): boolean {
	// Responses are valid if (1) they selected at least one action,
	if (responses.actions.length === 0) {
		return false;
	}

	// (2) they answered all likert questions,
	const allLikertAnswered = likertQuestions.every(
		(question) => responses.likert[question] !== undefined
	);
	if (!allLikertAnswered) {
		return false;
	}

	// and (3) they selected an overall quality rating.
	if (responses.overallQuality === null) {
		return false;
	}

	return true;
}

function ActionQuestion({
	postUUID,
	responses,
	setResponses,
}: {
	postUUID: string;
	responses: Response;
	setResponses: React.Dispatch<React.SetStateAction<Response>>;
}) {
	// Randomly sorting the actions.
	const actions: Array<Actions> = [
		...(new chance(postUUID).shuffle([
			"share",
			"comment",
			"like",
			"read more",
		]) as Array<"share" | "comment" | "like" | "read more">),
		"ignore" as "ignore",
	];

	const handleActionChange = (action: string) => {
		setResponses((prev: Response) => {
			if (action === "ignore") {
				return { ...prev, actions: ["ignore"] };
			}

			return {
				...prev,
				actions: prev.actions.includes(action)
					? prev.actions.filter((a) => a !== action)
					: [...prev.actions.filter((a) => a !== "ignore"), action],
			};
		});
	};

	return (
		<div>
			<h2 className="font-bold mb-2">
				What actions would you take on this post? (Select all that apply.)
			</h2>
			<div className="flex flex-col gap-2">
				{actions.map((action) => (
					<label key={action} className="flex items-center gap-2">
						<input
							type="checkbox"
							value={action}
							checked={responses.actions.includes(action)}
							onChange={() => handleActionChange(action)}
						/>
						{action.charAt(0).toUpperCase() + action.slice(1)}
					</label>
				))}
			</div>
		</div>
	);
}

function QualityQuestion({
	responses,
	setResponses,
}: {
	responses: Response;
	setResponses: React.Dispatch<React.SetStateAction<Response>>;
}) {
	const handleOverallQualityChance = (value: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
		setResponses({
			...responses,
			overallQuality: value,
		});
	};

	return (
		<div>
			<h2 className="font-bold mb-2">
				How would you rate the overall quality of this post?
			</h2>
			<div className="flex flex-wrap gap-2 mb-2">
				{[1, 2, 3, 4, 5, 6, 7].map((value) => (
					<label key={value} className="flex items-center gap-2">
						<input
							type="radio"
							name={"Overall Quality"}
							value={value}
							checked={responses.overallQuality === value}
							onChange={() =>
								handleOverallQualityChance(value as 1 | 2 | 3 | 4 | 5 | 6 | 7)
							}
						/>
						<span className="text-[8pt]">{value}</span>
					</label>
				))}
			</div>
		</div>
	);
}

function LikertQuestions({
	responses,
	setResponses,
}: {
	responses: Response;
	setResponses: React.Dispatch<React.SetStateAction<Response>>;
}) {
	const handleLikertChange = (question: string, value: string) => {
		setResponses({
			...responses,
			likert: { ...responses.likert, [question]: value },
		});
	};

	return (
		<div>
			<h2 className="font-bold mb-2">How would you describe this post?</h2>
			<div className="flex flex-col gap-4">
				{likertQuestions.map((question) => (
					<div key={question}>
						<p className="mb-2 italic">{question}</p>
						<div className="flex flex-wrap gap-2">
							{likertOptions.map((value) => (
								<label key={value} className="flex items-center gap-2">
									<input
										type="radio"
										name={question}
										value={value}
										checked={responses.likert[question] === value}
										onChange={() => handleLikertChange(question, value)}
									/>
									<span className="text-[8pt]">{value}</span>
								</label>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function handleFeedPhaseSubmit(
	phase: "phase2" | "phase3",
	position: number,
	completedPosts: string[],
	setCompletedPosts: (posts: string[]) => void,
	selectedPost: string,
	setSelectedPost: (post: string) => void,
	survey: Survey,
	setSurvey: (survey: Survey) => void,
	responses: Response
): void {
	setCompletedPosts([...completedPosts, selectedPost]);

	setSelectedPost("");

	setSurvey({
		...survey,
		[phase === "phase2" ? "Phase2" : "Phase3"]: {
			snapshot: "",
			responses: {
				...(phase === "phase2"
					? survey.Phase2?.responses
					: survey.Phase3?.responses),
				[position!]: {
					postUUID: selectedPost,
					actions: responses.actions,
					likert: responses.likert,
				},
			},
		},
	});

	console.log(completedPosts);
}

const emptyResponse: Response = {
	actions: [],
	likert: {},
	overallQuality: null,
};

export function PostQuestionnaire({
	post,
	postUUID,
	phase,
	currentPost,
	setCurrentPost,
	position,
}: {
	post: Post;
	postUUID: string;
	phase: "phase1" | "phase2" | "phase3";
	currentPost?: number; // State that is only used for the PostPhase.
	setCurrentPost?: (currentPost: number) => void; // Only used for the PostPhase.
	position?: number; // State that is only used for the FeedPhase.
}) {
	const { survey, setSurvey, setPhase, phase2Posts, phase3Posts } =
		useContext(SurveyContext);
	const { selectedPost, setSelectedPost, completedPosts, setCompletedPosts } =
		useContext(PhaseContext);

	// Managing the state of the post-level response.
	const [responses, setResponses] = useState<Response>(emptyResponse);

	// Clear answers when postUUID changes.
	useEffect(() => {
		setResponses({ actions: [], likert: {}, overallQuality: null });
	}, [postUUID]);

	const handleSubmit = () => {
		if (completedPosts.includes(selectedPost)) return;

		// Validate answers.
		if (!valid(responses)) {
			alert("Please answer all the questions.");
			return;
		}

		if (phase === "phase1") {
			// Input the response into the survey object.
			setSurvey({
				...survey,
				Phase1: {
					snapshot: "",
					responses: {
						...survey.Phase1?.responses,
						[currentPost!]: {
							postUUID: postUUID,
							actions: responses.actions,
							likert: responses.likert,
						},
					},
				},
			});

			// Increment currentPost.
			setSelectedPost("");
			setCurrentPost!(currentPost! + 1);

			if (currentPost === 2) {
				// FIXME: Use completedPost logic to handle this transition.
				setPhase("instructions-2");
				setSelectedPost("");
			}
		} else if (phase === "phase2" || phase === "phase3") {
			handleFeedPhaseSubmit(
				phase,
				position!,
				completedPosts,
				setCompletedPosts,
				selectedPost,
				setSelectedPost,
				survey,
				setSurvey,
				responses
			);

			// Handles transitions.
			if (
				phase === "phase2" &&
				completedPosts.length + 1 === phase2Posts.length
			) {
				// Add one because completedPosts is a copy of the state and doesn't
				// update immediately in handleSubmit.
				setPhase("transition");
				setCompletedPosts([]);
				setSelectedPost("");
				setResponses(emptyResponse);
			} else if (
				phase === "phase3" &&
				completedPosts.length + 1 === phase3Posts.length
			) {
				setPhase("exit");
				setCompletedPosts([]);
				setSelectedPost("");
				setResponses(emptyResponse);
			}
		}
	};

	return (
		<div className="w-1/2 sticky top-2 self-start flex flex-col gap-1 outline-2 outline-blue-500 rounded-md p-4 text-[8pt]">
			<h2 className="font-bold text-[10pt]">Survey Questions</h2>
			<div className="text-gray-600">
				<i>Title of Selected Post:</i> {post.title}
			</div>
			<HorizontalLine />
			<ActionQuestion
				postUUID={postUUID}
				responses={responses}
				setResponses={setResponses}
			/>
			<HorizontalLine />
			<LikertQuestions responses={responses} setResponses={setResponses} />
			<HorizontalLine />
			<QualityQuestion responses={responses} setResponses={setResponses} />
			<button
				className={`py-2 rounded-md text-[8pt] transition-colors ${
					valid(responses)
						? "bg-blue-500 text-white hover:bg-blue-600"
						: "bg-gray-300 text-gray-500 cursor-not-allowed"
				}`}
				onClick={handleSubmit}
				disabled={!valid(responses)}
			>
				{valid(responses) ? "Submit" : "Please answer all the questions."}
			</button>
		</div>
	);
}
