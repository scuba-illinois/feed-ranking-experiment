import React, { JSX, useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Body, Header, RedAsterisk } from "../components/general";
import { Answers, ExitQuestionnaireAnswers } from "../types";
import { pickRandomItems } from "../utils";

type Examples = {
	selectedPost: {
		feedUUID: string;
		postUUID: string;
	};
	ratedPost: {
		feedUUID: string;
		postUUID: string;
		relevance: number;
		trust: number;
		quality: number;
	};
	nonSelectedPost: {
		feedUUID: string;
		postUUID: string;
	};
};

const TextArea = ({
	value,
	onChange,
	rows = 2,
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	rows?: number;
}) => (
	<textarea
		className="w-full p-2 border border-gray-300 rounded-md text-[10pt] resize-none mt-3"
		rows={rows}
		placeholder="Enter your answer here."
		value={value}
		onChange={onChange}
	/>
);

const ContinueButton = ({
	exitAnswers,
}: {
	exitAnswers: ExitQuestionnaireAnswers;
}) => {
	const {
		participantID,
		consentTimestamp,
		answers,
		feeds,
		screenerAnswers,
		screenerTimestamp,
		setPhase,
		setExitAnswers,
		setExitTimestamp,
		setSubmitted,
	} = useContext(SurveyContext);

	const isValid =
		exitAnswers.postSelectionExplained.trim() !== "" &&
		exitAnswers.selectedPostExplained.trim() !== "" &&
		exitAnswers.nonSelectedPostExplained.trim() !== "" &&
		exitAnswers.relevanceExplained.trim() !== "" &&
		exitAnswers.trustExplained.trim() !== "" &&
		exitAnswers.qualityExplained.trim() !== "" &&
		exitAnswers.postLikelihood > 0;

	return (
		<button
			disabled={!isValid}
			className={
				"bg-blue-500 text-white rounded-md px-4 py-2 mt-2 w-[100%] text-[10pt]" +
				(isValid ? "" : " opacity-50 cursor-not-allowed")
			}
			onClick={() => {
				const exitTimestamp = new Date().toISOString();

				setExitAnswers(answers || {});
				setExitTimestamp(exitTimestamp);

				setSubmitted("PENDING");

				fetch("https://trending-backend.vercel.app/submit", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						participantID: participantID,
						consentTimestamp: consentTimestamp,
						feeds: feeds,
						screenerAnswers: screenerAnswers,
						screenerTimestamp: screenerTimestamp,
						answers: answers,
						exitAnswers: exitAnswers,
						exitTimestamp: exitTimestamp,
					}),
				})
					.then((response) => {
						response.json().then((data) => {
							if (data.status === "success") {
								setSubmitted("SUBMITTED");
							} else {
								setSubmitted("ERROR");
							}
						});
					})
					.catch((_) => {
						setSubmitted("ERROR");
					});

				setPhase("GOODBYE");
			}}
		>
			Submit
		</button>
	);
};

const PostSelection = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<TextArea
				value={answers.postSelectionExplained || ""}
				onChange={(e) =>
					setAnswers({ ...answers, postSelectionExplained: e.target.value })
				}
			/>
		</div>
	);
};

const SelectedPostExample = ({
	answers,
	setAnswers,
	post,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
	post: { feedUUID: string; postUUID: string } | undefined;
}) => {
	if (!post) {
		return <></>;
	}

	const { postURLs } = useContext(SurveyContext);

	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={postURLs[post.feedUUID][post.postUUID]}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<TextArea
				value={answers.selectedPostExplained || ""}
				onChange={(e) =>
					setAnswers({ ...answers, selectedPostExplained: e.target.value })
				}
			/>
		</div>
	);
};

const NonSelectedPostExample = ({
	answers,
	setAnswers,
	post,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
	post: { feedUUID: string; postUUID: string } | undefined;
}) => {
	if (!post) {
		return <></>;
	}

	const { postURLs } = useContext(SurveyContext);

	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={postURLs[post.feedUUID][post.postUUID]}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<TextArea
				value={answers.nonSelectedPostExplained || ""}
				onChange={(e) =>
					setAnswers({ ...answers, nonSelectedPostExplained: e.target.value })
				}
			/>
		</div>
	);
};

const RatingExplanations = ({
	answers,
	setAnswers,
	post,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
	post:
		| {
				feedUUID: string;
				postUUID: string;
				relevance: number;
				trust: number;
				quality: number;
		  }
		| undefined;
}) => {
	if (!post) {
		return <></>;
	}

	const { postURLs } = useContext(SurveyContext);

	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={postURLs[post.feedUUID][post.postUUID]}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<div className="mt-2 flex flex-col gap-4">
				<div>
					<Body>
						(4a) For relevance, you gave this post a{" "}
						{post.relevance.toLocaleString()} out of 7. How did you evaluate the
						relevance of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.relevanceExplained || ""}
						onChange={(e) =>
							setAnswers({ ...answers, relevanceExplained: e.target.value })
						}
						rows={2}
					/>
				</div>
				<div>
					<Body>
						(4b) For trustworthiness, you gave this post a{" "}
						{post.trust.toLocaleString()} out of 7. How did you evaluate the
						trustworthiness of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.trustExplained || ""}
						onChange={(e) =>
							setAnswers({
								...answers,
								trustExplained: e.target.value,
							})
						}
						rows={2}
					/>
				</div>
				<div>
					<Body>
						(4c) For content quality, you gave this post a{" "}
						{post.quality.toLocaleString()} out of 7. How did you evaluate the
						content quality of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.qualityExplained || ""}
						onChange={(e) =>
							setAnswers({
								...answers,
								qualityExplained: e.target.value,
							})
						}
						rows={2}
					/>
				</div>
			</div>
		</div>
	);
};

const PostLikelihood = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => {
	return (
		<div className="flex flex-row items-start w-full justify-center gap-6 my-2">
			<Body>Unlikely</Body>
			{[1, 2, 3, 4, 5, 6, 7].map((score) => (
				<div key={score} className="flex flex-col items-center">
					<input
						type="radio"
						name="postLikelihood"
						value={score}
						checked={answers.postLikelihood === score}
						onChange={() => setAnswers({ ...answers, postLikelihood: score })}
					/>
					<label className="text-[10pt] text-gray-600 mt-1">{score}</label>
				</div>
			))}
			<Body>Likely</Body>
		</div>
	);
};

const getSelectedPosts = (
	answers: Answers
): { feedUUID: string; postUUID: string }[] => {
	let selectedPosts: { feedUUID: string; postUUID: string }[] = [];

	for (const [feedUUID, value] of Object.entries(answers)) {
		// For each feed snapshot, pull out the selected posts prefixed with the snapshot UUID.
		selectedPosts = [
			...selectedPosts,
			...(value.selectedPosts!.map((postUUID) => ({
				feedUUID: feedUUID,
				postUUID: postUUID,
			})) || []),
		];
	}

	return selectedPosts;
};

const getNonSelectedPosts = (
	answers: Answers
): { feedUUID: string; postUUID: string }[] => {
	let nonSelectedPosts: { feedUUID: string; postUUID: string }[] = [];

	for (const [feedUUID, value] of Object.entries(answers)) {
		// For each feed snapshot, pull out the non-selected posts prefixed with the snapshot UUID.
		nonSelectedPosts = [
			...nonSelectedPosts,
			...(value.nonSelectedPosts!.map((postUUID) => ({
				feedUUID: feedUUID,
				postUUID: postUUID,
			})) || []),
		];
	}

	return nonSelectedPosts;
};

export const ExitQuestionnaire = () => {
	const { answers } = useContext(SurveyContext);

	const [_answers, _setAnswers] = useState<ExitQuestionnaireAnswers>({
		postSelectionExplained: "",
		selectedPostExplained: "",
		nonSelectedPostExplained: "",
		relevanceExplained: "",
		trustExplained: "",
		qualityExplained: "",
		postLikelihood: 0,
		selectedPostExample: { feedUUID: "", postUUID: "" },
		nonSelectedPostExample: { feedUUID: "", postUUID: "" },
		ratedPostExample: { feedUUID: "", postUUID: "" },
	});

	const [examples, setExamples] = useState<Examples | null>(null);

	useEffect(() => {
		// Gets all selected and non-selected posts from the answers,
		// formats it into a list of dicts in the form of:
		// { feedUUID: string, postUUID: string }.
		const selectedPosts = getSelectedPosts(answers);
		const nonSelectedPosts = getNonSelectedPosts(answers);

		const _selectedPostExample = pickRandomItems(selectedPosts, 1)[0];
		const _ratedPostExample = pickRandomItems(
			selectedPosts.filter(
				(post) =>
					post.feedUUID !== _selectedPostExample.feedUUID &&
					post.postUUID !== _selectedPostExample.postUUID
			),
			1
		)[0];
		const _nonSelectedPostExample = pickRandomItems(nonSelectedPosts, 1)[0];

		setExamples({
			selectedPost: _selectedPostExample,
			ratedPost: {
				..._ratedPostExample,
				relevance:
					answers[_ratedPostExample.feedUUID]!.ratings![
						_ratedPostExample.postUUID
					].relevance,
				trust:
					answers[_ratedPostExample.feedUUID]!.ratings![
						_ratedPostExample.postUUID
					].trust,
				quality:
					answers[_ratedPostExample.feedUUID]!.ratings![
						_ratedPostExample.postUUID
					].quality,
			},
			nonSelectedPost: _nonSelectedPostExample,
		});

		// Remember which examples you showed in the exit questionnaire.
		_setAnswers((state) => ({
			...state,
			selectedPostExample: _selectedPostExample,
			nonSelectedPostExample: _nonSelectedPostExample,
			ratedPostExample: _ratedPostExample,
		}));
	}, []);

	const questions: {
		question: string | JSX.Element;
		component: JSX.Element;
	}[] = [
		{
			question: (
				<>
					How did you determine which posts you selected?
					<RedAsterisk />
				</>
			),
			component: <PostSelection answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					Given this example of a post you selected, can you explain what about
					this post made you select it?
					<RedAsterisk />
				</>
			),
			component: (
				<SelectedPostExample
					answers={_answers}
					setAnswers={_setAnswers}
					post={examples?.selectedPost}
				/>
			),
		},
		{
			question: (
				<>
					Given this example of a post you didn't select, can you explain why
					you didn't choose this post?
					<RedAsterisk />
				</>
			),
			component: (
				<NonSelectedPostExample
					answers={_answers}
					setAnswers={_setAnswers}
					post={examples?.nonSelectedPost}
				/>
			),
		},
		{
			question: (
				<>
					Here is a post you rated with the scores below. Can you explain how
					you evaluated the post for each feature?
					<RedAsterisk />
				</>
			),
			component: (
				<RatingExplanations
					answers={_answers}
					setAnswers={_setAnswers}
					post={examples?.ratedPost}
				/>
			),
		},
		{
			question: (
				<>
					How likely are you to encounter content similar to what you saw during
					the experiment?
					<RedAsterisk />
				</>
			),
			component: <PostLikelihood answers={_answers} setAnswers={_setAnswers} />,
		},
	];

	return (
		<div className="flex justify-center h-[100vh] py-4">
			<div className="flex flex-col w-[560px] gap-2 items-start">
				<Header>Exit Questionnaire</Header>
				<Body>
					Before finishing this experiment, please complete the following
					questions. Questions marked with <RedAsterisk /> are required.
				</Body>
				<div className="flex flex-col gap-4 mt-1 w-full">
					{questions.map(({ question, component }, index) => (
						<div key={index}>
							<p className="text-[10pt] text-gray-600">
								({index + 1}) {question}
							</p>
							{component}
						</div>
					))}
				</div>
				{/* BUG:I have no idea why this padding needs to be this way for there to
         be some space below the button. How is this different than 
         Intro.tsx's solution. */}
				<div className="pb-4 w-full">
					<ContinueButton exitAnswers={_answers} />
				</div>
			</div>
		</div>
	);
};
