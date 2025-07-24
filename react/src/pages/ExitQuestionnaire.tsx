import React, { JSX, useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Body, Header, RedAsterisk } from "../components/general";
import { Answers } from "../types";
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

const ContinueButton = () => {
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
		exitAnswers,
		setExitAnswers,
		setExitEnd,
		setExitDuration,
		setTotalDuration,
		setSubmitted,
		setCompensation,
	} = useContext(SurveyContext);

	const isValid =
		exitAnswers.selectionExplained.length !== 0 &&
		exitAnswers.selectedPostExplained.length !== 0 &&
		exitAnswers.nonSelectedPostExplained.length !== 0 &&
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

const PostLikelihood = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	return (
		<div className="flex flex-row items-start w-full justify-center gap-6 mt-4">
			<Body>Unlikely</Body>
			{[1, 2, 3, 4, 5].map((score) => (
				<label
					key={score}
					className="flex flex-col items-center gap-2 cursor-pointer"
				>
					<input
						type="radio"
						name="postLikelihood"
						value={score}
						checked={exitAnswers.postLikelihood === score}
						onChange={() =>
							setExitAnswers((state) => ({ ...state, postLikelihood: score }))
						}
						className="cursor-pointer"
					/>
					<span className="text-[10pt] text-gray-600 mt-1">{score}</span>
				</label>
			))}
			<Body>Likely</Body>
		</div>
	);
};

const AttentionCheck = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	return (
		<div className="flex flex-row items-start w-full justify-center gap-6 mt-4">
			<Body>Disagree</Body>
			{[1, 2, 3, 4, 5].map((score) => (
				<label
					key={score}
					className="flex flex-col items-center gap-2 cursor-pointer"
				>
					<input
						type="radio"
						name="attentionCheck"
						value={score}
						checked={exitAnswers.attentionCheck === score}
						onChange={() =>
							setExitAnswers({ ...exitAnswers, attentionCheck: score })
						}
						className="cursor-pointer"
					/>
					<span className="text-[10pt] text-gray-600 mt-1">{score}</span>
				</label>
			))}
			<Body>Agree</Body>
		</div>
	);
};

const AgeQuestion = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	const AGE_GROUPS = [
		"18-24",
		"25-34",
		"35-44",
		"45-54",
		"55-64",
		"65 or older",
		"Prefer not to say",
	];

	return (
		<div className="flex flex-col gap-2 mt-2">
			{AGE_GROUPS.map((ageGroup) => (
				<label key={ageGroup} className="flex gap-2">
					<input
						type="radio"
						name="age"
						value={ageGroup}
						checked={exitAnswers.age === ageGroup}
						onChange={() => setExitAnswers({ ...exitAnswers, age: ageGroup })}
					/>
					<span className="text-[10pt] text-gray-600">{ageGroup}</span>
				</label>
			))}
		</div>
	);
};

const GenderQuestion = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	const GENDER_OPTIONS = [
		"Man",
		"Woman",
		"Non-binary / Third gender",
		"Prefer not to say",
	];

	return (
		<div className="flex flex-col gap-2 mt-2">
			{GENDER_OPTIONS.map((gender) => (
				<label key={gender} className="flex gap-2">
					<input
						type="radio"
						name="gender"
						value={gender}
						checked={exitAnswers.gender === gender}
						onChange={() => setExitAnswers({ ...exitAnswers, gender })}
					/>
					<span className="text-[10pt] text-gray-600">{gender}</span>
				</label>
			))}
		</div>
	);
};

const EducationQuestion = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	const EDUCATION_OPTIONS = [
		"Less than high school",
		"High school graduate or equivalent (e.g., GED)",
		"Some college, no degree",
		"Associate degree (e.g., AA, AS)",
		"Bachelor's degree (e.g., BA, BS)",
		"Master's degree (e.g., MA, MS, MBA)",
		"Graduate degree (e.g., PhD, MD, JD)",
		"Prefer not to say",
	];

	return (
		<div className="flex flex-col gap-2 mt-2">
			{EDUCATION_OPTIONS.map((education) => (
				<label key={education} className="flex gap-2">
					<input
						type="radio"
						name="education"
						value={education}
						checked={exitAnswers.education === education}
						onChange={() =>
							setExitAnswers((state) => ({ ...state, education: education }))
						}
					/>
					<span className="text-[10pt] text-gray-600">{education}</span>
				</label>
			))}
		</div>
	);
};

const FeedbackQuestion = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);

	return (
		<div>
			<TextArea
				value={exitAnswers.feedback}
				onChange={(e) =>
					setExitAnswers((state) => ({ ...state, feedback: e.target.value }))
				}
			/>
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

const PostSelection = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);
	const [other, setOther] = useState("");

	const OPTIONS = [
		"The position of the post on the feed",
		"The content of the post",
		"The number of upvotes on the post",
		"The number of comments on the post",
		"The subreddit the post is from",
	];

	const includesOther = () =>
		exitAnswers.selectionExplained.some(
			(_option) => typeof _option === "object" && _option.option === "Other: "
		);

	return (
		<div className="flex flex-col gap-2 mt-2">
			{OPTIONS.map((option) => {
				const isChecked = exitAnswers.selectionExplained.includes(option);

				const handleChange = () => {
					setExitAnswers((state) => {
						let updated = [...state.selectionExplained];

						if (isChecked) {
							updated = updated.filter((_option) => _option != option);
						} else {
							updated = [...updated, option];
						}

						return {
							...state,
							selectionExplained: updated,
						};
					});
				};

				return (
					<label key={option} className="flex gap-2">
						<input
							type="checkbox"
							name="selectionExplained"
							value={option}
							checked={isChecked}
							onChange={handleChange}
						/>
						<span className="text-[10pt] text-gray-600">{option}</span>
					</label>
				);
			})}

			{/* Checkbox for "Other: " option */}
			<label className="flex gap-2">
				<input
					type="checkbox"
					name="selectionExplained"
					value={other}
					checked={includesOther()}
					onChange={() => {
						setExitAnswers((state) => {
							let updated = [...state.selectionExplained];

							if (includesOther()) {
								updated = updated.filter(
									(_option) =>
										typeof _option !== "object" || _option.option !== "Other: "
								);
							} else {
								updated.push({ option: "Other: ", value: other });
							}

							return {
								...state,
								selectionExplained: updated,
							};
						});
					}}
				/>
				<span className="text-[10pt] text-gray-600">
					Other:{" "}
					<input
						className="border border-gray-300 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt] ml-1 w-[250px]"
						placeholder="Please specify"
						value={other}
						onChange={(e) => {
							setOther(e.target.value);

							setExitAnswers((state) => ({
								...state,
								selectionExplained: state.selectionExplained.map((_option) =>
									typeof _option === "object" && _option.option === "Other: "
										? { option: "Other: ", value: e.target.value }
										: _option
								),
							}));
						}}
					/>
				</span>
			</label>
		</div>
	);
};

const SelectedPostExample = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);
	const [other, setOther] = useState("");

	const OPTIONS = [
		"This post looked relevant to me",
		"This post looked trustworthy",
		"This post seemed to be high quality",
	];

	const includesOther = () =>
		exitAnswers.selectedPostExplained.some(
			(_option) => typeof _option === "object" && _option.option === "Other: "
		);

	return (
		<div className="flex flex-col gap-2 mt-2">
			{OPTIONS.map((option) => {
				const isChecked = exitAnswers.selectedPostExplained.includes(option);

				const handleChange = () => {
					setExitAnswers((state) => {
						let updated = [...state.selectedPostExplained];

						if (isChecked) {
							updated = updated.filter((_option) => _option != option);
						} else {
							updated = [...updated, option];
						}

						return {
							...state,
							selectedPostExplained: updated,
						};
					});
				};

				return (
					<label key={option} className="flex gap-2">
						<input
							type="checkbox"
							name="selectedPostExplained"
							value={option}
							checked={isChecked}
							onChange={handleChange}
						/>
						<span className="text-[10pt] text-gray-600">{option}</span>
					</label>
				);
			})}

			{/* Checkbox for "Other: " option */}
			<label className="flex gap-2">
				<input
					type="checkbox"
					name="selectedPostExplained"
					value={other}
					checked={includesOther()}
					onChange={() => {
						setExitAnswers((state) => {
							let updated = [...state.selectedPostExplained];

							if (includesOther()) {
								updated = updated.filter(
									(_option) =>
										typeof _option !== "object" || _option.option !== "Other: "
								);
							} else {
								updated.push({ option: "Other: ", value: other });
							}

							return {
								...state,
								selectedPostExplained: updated,
							};
						});
					}}
				/>
				<span className="text-[10pt] text-gray-600">
					Other:{" "}
					<input
						className="border border-gray-300 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt] ml-1 w-[250px]"
						placeholder="Please specify"
						value={other}
						onChange={(e) => {
							setOther(e.target.value);

							setExitAnswers((state) => ({
								...state,
								selectedPostExplained: state.selectedPostExplained.map(
									(_option) =>
										typeof _option === "object" && _option.option === "Other: "
											? { option: "Other: ", value: e.target.value }
											: _option
								),
							}));
						}}
					/>
				</span>
			</label>
		</div>
	);
};

const NonSelectedPostExample = () => {
	const { exitAnswers, setExitAnswers } = useContext(SurveyContext);
	const [other, setOther] = useState("");

	const OPTIONS = [
		"This post did not look relevant to me",
		"This post did not look trustworthy",
		"This post did not seem to be high quality",
	];

	const includesOther = () =>
		exitAnswers.nonSelectedPostExplained.some(
			(_option) => typeof _option === "object" && _option.option === "Other: "
		);

	return (
		<div className="flex flex-col gap-2 mt-2">
			{OPTIONS.map((option) => {
				const isChecked = exitAnswers.nonSelectedPostExplained.includes(option);

				const handleChange = () => {
					setExitAnswers((state) => {
						let updated = [...state.nonSelectedPostExplained];

						if (isChecked) {
							updated = updated.filter((_option) => _option != option);
						} else {
							updated = [...updated, option];
						}

						return {
							...state,
							nonSelectedPostExplained: updated,
						};
					});
				};

				return (
					<label key={option} className="flex gap-2">
						<input
							type="checkbox"
							name="nonSelectedPostExplained"
							value={option}
							checked={isChecked}
							onChange={handleChange}
						/>
						<span className="text-[10pt] text-gray-600">{option}</span>
					</label>
				);
			})}

			{/* Checkbox for "Other: " option */}
			<label className="flex gap-2">
				<input
					type="checkbox"
					name="nonSelectedPostExplained"
					value={other}
					checked={includesOther()}
					onChange={() => {
						setExitAnswers((state) => {
							let updated = [...state.nonSelectedPostExplained];

							if (includesOther()) {
								updated = updated.filter(
									(_option) =>
										typeof _option !== "object" || _option.option !== "Other: "
								);
							} else {
								updated.push({ option: "Other: ", value: other });
							}

							return {
								...state,
								nonSelectedPostExplained: updated,
							};
						});
					}}
				/>
				<span className="text-[10pt] text-gray-600">
					Other:{" "}
					<input
						className="border border-gray-300 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt] ml-1 w-[250px]"
						placeholder="Please specify"
						value={other}
						onChange={(e) => {
							setOther(e.target.value);

							setExitAnswers((state) => ({
								...state,
								nonSelectedPostExplained: state.nonSelectedPostExplained.map(
									(_option) =>
										typeof _option === "object" && _option.option === "Other: "
											? { option: "Other: ", value: e.target.value }
											: _option
								),
							}));
						}}
					/>
				</span>
			</label>
		</div>
	);
};

export const ExitQuestionnaire = () => {
	const { answers, setExitStart, exitAnswers, setExitAnswers, postURLs } =
		useContext(SurveyContext);

	useEffect(() => {
		setExitStart(new Date().toISOString());

		// Gets all selected and non-selected posts from the answers,
		// formats it into a list of dicts in the form of:
		// { feedUUID: string, postUUID: string }.
		const selectedPosts = getSelectedPosts(answers);
		const nonSelectedPosts = getNonSelectedPosts(answers);

		if (selectedPosts.length === 0 || nonSelectedPosts.length === 0) {
			return;
		}

		const selectedPostExample = pickRandomItems(selectedPosts, 1)[0];
		const nonSelectedPostExample = pickRandomItems(nonSelectedPosts, 1)[0];

		setExitAnswers((state) => ({
			...state,
			selectedPostExample: {
				feedUUID: selectedPostExample.feedUUID,
				postUUID: selectedPostExample.postUUID,
			},
			nonSelectedPostExample: {
				feedUUID: nonSelectedPostExample.feedUUID,
				postUUID: nonSelectedPostExample.postUUID,
			},
		}));
	}, []);

	const questions: {
		question: string | JSX.Element;
		component: JSX.Element;
	}[] = [
		{
			question: (
				<>
					(1) How did you determine which posts you selected?
					<RedAsterisk />
				</>
			),
			component: <PostSelection />,
		},
		{
			question: (
				<div>
					{exitAnswers.selectedPostExample.feedUUID !== "" && (
						<div className="w-full flex justify-center mb-4">
							<img
								src={
									postURLs[exitAnswers.selectedPostExample.feedUUID][
										exitAnswers.selectedPostExample.postUUID
									]
								}
								style={{ maxHeight: "300px" }}
								className="border-2 mt-2 mb-1"
							/>
						</div>
					)}
					<span>
						(2) This was a post you selected, can you explain what about this
						post made you select it?
						<RedAsterisk />
					</span>
				</div>
			),
			component: <SelectedPostExample />,
		},
		{
			question: (
				<div>
					{exitAnswers.selectedPostExample.feedUUID !== "" && (
						<div className="w-full flex justify-center mb-4">
							<img
								src={
									postURLs[exitAnswers.nonSelectedPostExample.feedUUID][
										exitAnswers.nonSelectedPostExample.postUUID
									]
								}
								style={{ maxHeight: "300px" }}
								className="border-2 mt-2 mb-1"
							/>
						</div>
					)}
					(3) This was a post you did not select, can you explain what about
					this post made you select it?
					<RedAsterisk />
				</div>
			),
			component: <NonSelectedPostExample />,
		},
		{
			question: (
				<>
					For this question only, please select 5 as your answer.
					<RedAsterisk />
				</>
			),
			component: <AttentionCheck />,
		},

		{
			question: (
				<>
					How likely are you to encounter content similar to what you saw during
					the experiment?
					<RedAsterisk />
				</>
			),
			component: <PostLikelihood />,
		},
		{
			question: (
				<>
					Do you have any feedback about your experience participating in this
					study?
				</>
			),
			component: <FeedbackQuestion />,
		},
		{
			question: (
				<>
					What is your age?
					<RedAsterisk />
				</>
			),
			component: <AgeQuestion />,
		},
		{
			question: (
				<>
					What is your gender?
					<RedAsterisk />
				</>
			),
			component: <GenderQuestion />,
		},
		{
			question: (
				<>
					What is the highest level of education you have completed?
					<RedAsterisk />
				</>
			),
			component: <EducationQuestion />,
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
							<p className="text-[10pt] text-gray-600">{question}</p>
							{component}
						</div>
					))}
				</div>
				{/* BUG: I have no idea why this padding needs to be this way for there to
         be some space below the button. How is this different than 
         Intro.tsx's solution. */}
				<div className="mt-2 pb-4 w-full">
					<ContinueButton />
				</div>
			</div>
		</div>
	);
};
