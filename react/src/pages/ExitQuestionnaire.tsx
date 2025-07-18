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
		manipulation: number;
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
		prolific,
		consentTimestamp,
		answers,
		feeds,
		screenerAnswers,
		screenerStart,
		screenerEnd,
		screenerDuration,
		setPhase,
		exitStart,
		setExitAnswers,
		setExitEnd,
		setExitDuration,
		setTotalDuration,
		setSubmitted,
		setCompensation,
	} = useContext(SurveyContext);

	const isValid =
		exitAnswers.postSelectionExplained.trim() !== "" &&
		exitAnswers.selectedPostExplained.trim() !== "" &&
		exitAnswers.nonSelectedPostExplained.trim() !== "" &&
		exitAnswers.relevanceExplained.trim() !== "" &&
		exitAnswers.manipulationExplained.trim() !== "" &&
		exitAnswers.qualityExplained.trim() !== "" &&
		exitAnswers.postLikelihood > 0 &&
		exitAnswers.attentionCheck > 0 &&
		exitAnswers.age.trim() !== "" &&
		exitAnswers.gender.trim() !== "" &&
		exitAnswers.education.trim() !== "";

	return (
		<button
			disabled={!isValid}
			className={
				"bg-blue-500 text-white rounded-md px-4 py-2 mt-2 w-[100%] text-[10pt]" +
				(isValid ? "" : " opacity-50 cursor-not-allowed")
			}
			onClick={() => {
				const exitEnd = new Date();
				const exitDuration =
					(exitEnd.getTime() - new Date(exitStart).getTime()) / 1_000;
				const totalDuration =
					(exitEnd.getTime() - new Date(consentTimestamp).getTime()) / 1_000;

				setExitAnswers(exitAnswers);

				setExitEnd(exitEnd.toISOString());
				setExitDuration(exitDuration);
				setTotalDuration(totalDuration);

				setSubmitted("PENDING");

				fetch("https://trending-backend.vercel.app/submit", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						participantID: participantID,
						prolific: prolific,
						consentTimestamp: consentTimestamp,
						feeds: feeds,

						screenerAnswers: screenerAnswers,
						screenerStart: screenerStart,
						screenerEnd: screenerEnd,
						screenerDuration: screenerDuration,

						exitAnswers: exitAnswers,
						exitStart: exitStart,
						exitEnd: exitEnd,
						exitDuration: exitDuration,

						totalDuration: totalDuration,

						answers: answers,
					}),
				})
					.then((response) => {
						response.json().then((data) => {
							if (data.status === "success") {
								setCompensation({
									completionCode: data.completionCode,
									completionURL: data.completionURL,
								});

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
				manipulation: number;
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
						{post.relevance.toLocaleString()} out of 5. How did you evaluate the
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
						(4b) For manipulativeness, you gave this post a{" "}
						{post.manipulation.toLocaleString()} out of 5. How did you evaluate
						the manipulativeness of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.manipulationExplained || ""}
						onChange={(e) =>
							setAnswers({
								...answers,
								manipulationExplained: e.target.value,
							})
						}
						rows={2}
					/>
				</div>
				<div>
					<Body>
						(4c) For content quality, you gave this post a{" "}
						{post.quality.toLocaleString()} out of 5. How did you evaluate the
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
				<label
					key={score}
					className="flex flex-col items-center gap-2 cursor-pointer"
				>
					<input
						type="radio"
						name="postLikelihood"
						value={score}
						checked={answers.postLikelihood === score}
						onChange={() => setAnswers({ ...answers, postLikelihood: score })}
						className="cursor-pointer"
					/>
					<span className="text-[10pt] text-gray-600 mt-1">{score}</span>
				</label>
			))}
			<Body>Likely</Body>
		</div>
	);
};

const AttentionCheck = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => (
	<div className="flex flex-row items-start w-full justify-center gap-6 mt-6 mb-2 ">
		{[1, 2, 3, 4, 5, 6, 7, 8].map((minutes) => (
			<label
				key={minutes}
				className="flex flex-col items-center gap-2 cursor-pointer"
			>
				<input
					type="radio"
					name="attentionCheck"
					value={minutes}
					checked={answers.attentionCheck === minutes}
					onChange={() => setAnswers({ ...answers, attentionCheck: minutes })}
					className="cursor-pointer"
				/>
				<span className="text-[10pt] text-gray-600 mt-1">{minutes} min.</span>
			</label>
		))}
	</div>
);

const AgeQuestion = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => (
	<div className="flex flex-col gap-2 mt-2">
		{[
			"Under 18",
			"18-24",
			"25-34",
			"35-44",
			"45-54",
			"55-64",
			"65 or older",
			"Prefer not to say",
		].map((ageGroup) => (
			<label key={ageGroup} className="flex gap-2">
				<input
					type="radio"
					name="age"
					value={ageGroup}
					checked={answers.age === ageGroup}
					onChange={() => setAnswers({ ...answers, age: ageGroup })}
				/>
				<span className="text-[10pt] text-gray-600">{ageGroup}</span>
			</label>
		))}
	</div>
);

const GenderQuestion = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => (
	<div className="flex flex-col gap-2 mt-2">
		{["Man", "Woman", "Non-binary / Third gender", "Prefer not to say"].map(
			(gender) => (
				<label key={gender} className="flex gap-2">
					<input
						type="radio"
						name="gender"
						value={gender}
						checked={answers.gender === gender}
						onChange={() => setAnswers({ ...answers, gender })}
					/>
					<span className="text-[10pt] text-gray-600">{gender}</span>
				</label>
			)
		)}
	</div>
);

const EducationQuestion = ({
	answers,
	setAnswers,
}: {
	answers: ExitQuestionnaireAnswers;
	setAnswers: React.Dispatch<React.SetStateAction<ExitQuestionnaireAnswers>>;
}) => (
	<div className="flex flex-col gap-2 mt-2">
		{[
			"Less than high school",
			"High school graduate or equivalent (e.g., GED)",
			"Some college, no degree",
			"Associate degree (e.g., AA, AS)",
			"Bachelor's degree (e.g., BA, BS)",
			"Master's degree (e.g., MA, MS, MBA)",
			"Graduate degree (e.g., PhD, MD, JD)",
			"Prefer not to say",
		].map((education) => (
			<label key={education} className="flex gap-2">
				<input
					type="radio"
					name="education"
					value={education}
					checked={answers.education === education}
					onChange={() => setAnswers({ ...answers, education })}
				/>
				<span className="text-[10pt] text-gray-600">{education}</span>
			</label>
		))}
	</div>
);

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
	const { answers, setExitStart } = useContext(SurveyContext);

	const [_answers, _setAnswers] = useState<ExitQuestionnaireAnswers>({
		postSelectionExplained: "",
		selectedPostExplained: "",
		nonSelectedPostExplained: "",
		relevanceExplained: "",
		manipulationExplained: "",
		qualityExplained: "",
		attentionCheck: 0,
		age: "",
		gender: "",
		education: "",
		postLikelihood: 0,
		selectedPostExample: { feedUUID: "", postUUID: "" },
		nonSelectedPostExample: { feedUUID: "", postUUID: "" },
		ratedPostExample: { feedUUID: "", postUUID: "" },
	});

	const [examples, setExamples] = useState<Examples | null>(null);

	useEffect(() => {
		setExitStart(new Date().toISOString());

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
				manipulation:
					answers[_ratedPostExample.feedUUID]!.ratings![
						_ratedPostExample.postUUID
					].manipulation,
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
				<span>
					This is a post you selected, can you explain what about this post made
					you select it?
					<RedAsterisk />
				</span>
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
					This is a post you did <span className="italic">not</span> select, can
					you explain why you did not choose this post?
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
					This is a post you rated. Can you explain how you arrived at each
					score?
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
					How many <span className="italic">minutes</span> were you given to
					browse <span className="italic">each</span> feed?
					<RedAsterisk />
				</>
			),
			component: <AttentionCheck answers={_answers} setAnswers={_setAnswers} />,
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
		{
			question: (
				<>
					What is your age?
					<RedAsterisk />
				</>
			),
			component: <AgeQuestion answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					What is your gender?
					<RedAsterisk />
				</>
			),
			component: <GenderQuestion answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					What is the highest level of education you have completed?
					<RedAsterisk />
				</>
			),
			component: (
				<EducationQuestion answers={_answers} setAnswers={_setAnswers} />
			),
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
							{index === 6 && <hr className="my-4 border-gray-300" />}{" "}
							{/* FIXME: Stupid hack to get the horizontal rule above demographic questions. */}
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
