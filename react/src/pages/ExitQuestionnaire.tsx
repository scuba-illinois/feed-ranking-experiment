import React, { JSX, useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Body, Header, RedAsterisk } from "../components/general";
import { Answers, QuestionAnswers } from "../types";
import { pickRandomItems } from "../utils";

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

const ContinueButton = ({ answers }: { answers: Record<string, any> }) => {
	const { setPhase, setExitAnswers, setExitTimestamp } =
		useContext(SurveyContext);

	const isValid =
		Object.keys(answers).includes("postSelection") &&
		answers.postSelection.trim() !== "" &&
		Object.keys(answers).includes("selectedPostExample") &&
		answers.selectedPostExample.trim() !== "" &&
		Object.keys(answers).includes("nonSelectedPostExample") &&
		answers.nonSelectedPostExample.trim() !== "" &&
		Object.keys(answers).includes("relevanceExplained") &&
		answers.relevanceExplained.trim() !== "" &&
		Object.keys(answers).includes("trustworthinessExplained") &&
		answers.trustworthinessExplained.trim() !== "" &&
		Object.keys(answers).includes("contentQualityExplained") &&
		answers.contentQualityExplained.trim() !== "" &&
		Object.keys(answers).includes("postLikelihood");

	return (
		<button
			disabled={!isValid}
			className={
				"bg-blue-500 text-white rounded-md px-4 py-2 mt-2 w-[100%] text-[10pt]" +
				(isValid ? "" : " opacity-50 cursor-not-allowed")
			}
			onClick={() => {
				setExitAnswers(answers || {});
				setExitTimestamp(new Date().toISOString());
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
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<TextArea
				value={answers.postSelection || ""}
				onChange={(e) =>
					setAnswers({ ...answers, postSelection: e.target.value })
				}
			/>
		</div>
	);
};

const SelectedPostExample = ({
	answers,
	setAnswers,
	fileName,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	fileName: string;
}) => {
	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={fileName !== "" ? fileName : undefined}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<TextArea
				value={answers.selectedPostExample || ""}
				onChange={(e) =>
					setAnswers({ ...answers, selectedPostExample: e.target.value })
				}
			/>
		</div>
	);
};

const NonSelectedPostExample = ({
	answers,
	setAnswers,
	fileName,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	fileName: string;
}) => {
	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={fileName !== "" ? fileName : undefined}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<TextArea
				value={answers.nonSelectedPostExample || ""}
				onChange={(e) =>
					setAnswers({ ...answers, nonSelectedPostExample: e.target.value })
				}
			/>
		</div>
	);
};

const RatingExplanations = ({
	answers,
	setAnswers,
	fileName,
	ratings,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	fileName: string;
	ratings: QuestionAnswers | {};
}) => {
	if (Object.keys(ratings).length === 0) {
		<></>;
	}

	return (
		<div>
			<div className="w-full flex justify-center">
				<img
					src={fileName !== "" ? fileName : undefined}
					style={{ maxHeight: "300px" }}
					className="border-2 mt-2 mb-1"
				/>
			</div>
			<div className="mt-2 flex flex-col gap-4">
				<div>
					<Body>
						(4a) For relevance, you gave this post a{" "}
						{(ratings as QuestionAnswers).relevance} out of 7. How did you
						evaluate the relevance of this post?
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
						{(ratings as QuestionAnswers).trust} out of 7. How did you evaluate
						the trustworthiness of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.trustworthinessExplained || ""}
						onChange={(e) =>
							setAnswers({
								...answers,
								trustworthinessExplained: e.target.value,
							})
						}
						rows={2}
					/>
				</div>
				<div>
					<Body>
						(4c) For content quality, you gave this post a{" "}
						{(ratings as QuestionAnswers).quality} out of 7. How did you
						evaluate the content quality of this post?
						<RedAsterisk />
					</Body>
					<TextArea
						value={answers.contentQualityExplained || ""}
						onChange={(e) =>
							setAnswers({
								...answers,
								contentQualityExplained: e.target.value,
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
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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

const getSelectedPosts = (answers: Answers) => {
	let selectedPosts: string[] = [];

	for (const [snapshotUUID, value] of Object.entries(answers)) {
		// For each feed snapshot, pull out the selected posts prefixed with the snapshot UUID.
		selectedPosts = [
			...selectedPosts,
			...(value.selectedPosts!.map(
				(postUUID) => `${snapshotUUID}/${postUUID}.png`
			) || []),
		];
	}

	return selectedPosts;
};

const getNonSelectedPosts = (answers: Answers) => {
	let nonSelectedPosts: string[] = [];

	for (const [snapshotUUID, value] of Object.entries(answers)) {
		// For each feed snapshot, pull out the non-selected posts prefixed with the snapshot UUID.
		nonSelectedPosts = [
			...nonSelectedPosts,
			...(value.nonSelectedPosts!.map(
				(postUUID) => `${snapshotUUID}/${postUUID}.png`
			) || []),
		];
	}

	return nonSelectedPosts;
};

export const ExitQuestionnaire = () => {
	const { answers } = useContext(SurveyContext);

	const [_answers, _setAnswers] = useState<Record<string, any>>({});

	const selectedPosts = getSelectedPosts(answers);
	const nonSelectedPosts = getNonSelectedPosts(answers);

	const [selectedPostFileName, setSelectedPostFileName] = useState<string>("");
	const [nonSelectedPostFileName, setNonSelectedPostFileName] =
		useState<string>("");

	const [ratingFileName, setRatingFileName] = useState<string>("");
	const [ratings, setRatings] = useState<QuestionAnswers | {}>({});

	useEffect(() => {
		const _selectedPostFileName = pickRandomItems(selectedPosts, 1)[0];
		const _ratingFileName = pickRandomItems(
			selectedPosts.filter((post) => post !== _selectedPostFileName),
			1
		)[0];
		const _ratingSnapshotUUID = _ratingFileName.split("/")[0];
		const _ratingPostUUID = _ratingFileName.split("/")[1].replace(".png", "");

		setSelectedPostFileName(_selectedPostFileName);
		setNonSelectedPostFileName(pickRandomItems(nonSelectedPosts, 1)[0]);
		setRatingFileName(_ratingFileName);
		setRatings(answers[_ratingSnapshotUUID]?.ratings?.[_ratingPostUUID] ?? {});

		// Remember which examples you showed in the exit questionnaire.
		_setAnswers({
			selectedPostExampleSnapshotUUID: _selectedPostFileName.split("/")[0],
			selectedPostExamplePostUUID: _selectedPostFileName
				.split("/")[1]
				.replace(".png", ""),
			nonSelectedPostExampleSnapshotUUID: nonSelectedPostFileName.split("/")[0],
			nonSelectedPostExamplePostUUID: nonSelectedPostFileName
				.split("/")[1]
				.replace(".png", ""),
			ratingSnapshotUUID: _ratingSnapshotUUID,
			ratingPostUUID: _ratingPostUUID,
		});
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
					fileName={selectedPostFileName}
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
					fileName={nonSelectedPostFileName}
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
					fileName={ratingFileName}
					ratings={ratings}
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
		<div className="flex justify-center h-[100vh] gap-2 p-4">
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
					<ContinueButton answers={_answers} />
				</div>
			</div>
		</div>
	);
};
