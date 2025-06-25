import { JSX, useContext, useState } from "react";
import { Body, Header, RedAsterisk } from "../components/general";
import { SurveyContext } from "../contexts";

const Over18 = ({
	answers,
	setAnswers,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => (
	<div className="flex flex-col gap-1">
		<div className="flex gap-2">
			<input
				type="radio"
				name="age"
				value="yes"
				checked={answers.age === "yes"}
				onChange={() => setAnswers({ ...answers, age: "yes" })}
			/>
			<label className="text-[10pt] text-gray-600">Yes</label>
		</div>
		<div className="flex gap-2">
			<input
				type="radio"
				name="age"
				value="no"
				checked={answers.age === "no"}
				onChange={() => setAnswers({ ...answers, age: "no" })}
			/>
			<label className="text-[10pt] text-gray-600">No</label>
		</div>
	</div>
);

const InUSA = ({
	answers,
	setAnswers,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => (
	<div>
		<div className="flex flex-col gap-1">
			<div className="flex gap-2">
				<input
					type="radio"
					name="inUSA"
					value="yes"
					checked={answers.inUSA === "yes"}
					onChange={() => setAnswers({ ...answers, inUSA: "yes" })}
				/>
				<label className="text-[10pt] text-gray-600">Yes</label>
			</div>
			<div className="flex gap-2">
				<input
					type="radio"
					name="inUSA"
					value="no"
					checked={answers.inUSA === "no"}
					onChange={() => setAnswers({ ...answers, inUSA: "no" })}
				/>
				<label className="text-[10pt] text-gray-600">No</label>
			</div>
		</div>
	</div>
);

const RedditUsage = ({
	answers,
	setAnswers,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => (
	<select
		name="redditUsage"
		value={answers.redditUsage || ""}
		onChange={(e) => setAnswers({ ...answers, redditUsage: e.target.value })}
		className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt] text-gray-600"
	>
		<option hidden disabled value="">
			Select an option
		</option>
		<option value="never">Never</option>
		<option value="rarely">Rarely (1-2 times)</option>
		<option value="occasionally">Occasionally (3-10 times)</option>
		<option value="frequently">Frequently (11-20 times)</option>
		<option value="very_frequently">Very frequently (21-30 times)</option>
		<option value="almost_every_day">Almost every day</option>
		<option value="every_day">Every day or multiple times per day</option>
	</select>
);

const RedditSubreddits = ({
	answers,
	setAnswers,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => {
	const [subreddit, setSubreddit] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Enter" &&
			subreddit.trim() !== "" &&
			(answers.subreddits || []).some(
				(_subreddit: string) =>
					_subreddit.trim().toLowerCase() === subreddit.trim().toLowerCase()
			) === false
		) {
			setAnswers((state) => ({
				...state,
				subreddits: [...(answers.subreddits || []), subreddit.trim()],
			}));
			setSubreddit("");
		}
	};

	const handleRemove = (index: number) => {
		setAnswers((state) => ({
			...state,
			subreddits: [
				...(state.subreddits as string[]).filter((_, i) => i !== index),
			],
		}));
	};

	return (
		<div>
			<input
				type="text"
				value={subreddit}
				onChange={(e) => setSubreddit(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Enter a subreddit"
				className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt]"
			/>
			<ul className="flex flex-col gap-1 mt-2">
				{((answers.subreddits || []) as string[]).map((subreddit, index) => (
					<li key={index} className="text-[10pt] text-gray-600 flex gap-4">
						{subreddit}
						<button
							className="text-red-600"
							onClick={() => handleRemove(index)}
						>
							(X)
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

const Interests = ({
	answers,
	setAnswers,
}: {
	answers: Record<string, any>;
	setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) => {
	return (
		<div className="flex flex-wrap gap-y-3 gap-x-4">
			{[
				"Internet Culture",
				"Games",
				"Q&As",
				"Technology",
				"Pop Culture",
				"Movies & TV",
				"Anime",
				"Arts",
				"Business",
				"Collectibles & Other Hobbies",
				"Education & Career",
				"Fashion & Beauty",
				"Food & Drink",
				"Home & Garden",
				"Humanities & Law",
				"Music",
				"Nature & Outdoors",
				"News & Politics",
				"Places & Travel",
				"Science",
				"Sports",
				"Spooky",
				"Vehicles",
				"Wellness",
			].map((interest) => (
				<div key={interest} className="flex flex-row gap-2">
					<input
						key={interest}
						type="checkbox"
						name="interests"
						value={interest}
						checked={(answers.interests || []).includes(interest)}
						onChange={(e) => {
							const newInterests = e.target.checked
								? [...(answers.interests || []), interest]
								: (answers.interests || []).filter(
										(i: string) => i !== interest
								  );
							setAnswers({
								...answers,
								interests: [...new Set(newInterests)].sort(),
							});
						}}
					/>
					<label className="text-[10pt] text-gray-600">{interest} </label>
				</div>
			))}
		</div>
	);
};

export const Screeners = () => {
	const { setPhase, setScreenerAnswers, setScreenerTimestamp } =
		useContext(SurveyContext);

	const [_answers, _setAnswers] = useState<Record<string, any>>({});

	// const isValid = false;

	const isValid =
		Object.keys(_answers).includes("age") &&
		Object.keys(_answers).includes("inUSA") &&
		Object.keys(_answers).includes("redditUsage");

	const questions: {
		question: string | JSX.Element;
		component: JSX.Element;
	}[] = [
		{
			question: (
				<>
					Are you 18 years or older?
					<RedAsterisk />
				</>
			),
			component: <Over18 answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					Are you currently based in the United States?
					<RedAsterisk />
				</>
			),
			component: <InUSA answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					How many times have you used Reddit in the previous month?
					<RedAsterisk />
				</>
			),
			component: <RedditUsage answers={_answers} setAnswers={_setAnswers} />,
		},
		{
			question: (
				<>
					If applicable, what subreddits do you browse on Reddit? Press enter to
					add. Subreddits will be listed below. Do not include the 'r/' prefix.
					Subreddits are case <span className="italic">insensitive</span>. Click
					on <span className="text-red-600">(X)</span>
					{" to remove."}
				</>
			),
			component: (
				<RedditSubreddits answers={_answers} setAnswers={_setAnswers} />
			),
		},
		{
			question:
				"Which of these topics are you generally interested in? (Select all that apply.)",
			component: <Interests answers={_answers} setAnswers={_setAnswers} />,
		},
	];

	return (
		<div className="flex justify-center my-6">
			<div className="flex flex-col w-[560px] gap-2">
				<Header>Screener Questions</Header>
				<Body>
					Please answer the following questions before partaking in this study.
					Questions marked with <RedAsterisk /> are required.
				</Body>
				<div className="flex flex-col gap-4 mt-1">
					{questions.map(({ question, component }, index) => (
						<div key={index} className="flex flex-col gap-2">
							<p className="text-[10pt] text-gray-600">
								({index + 1}) {question}
							</p>
							{component}
						</div>
					))}
				</div>
				<button
					className={
						"bg-blue-500 text-white rounded-md px-4 py-2 mt-2 w-[100%] text-[10pt]" +
						(isValid ? "" : " opacity-50 cursor-not-allowed")
					}
					disabled={!isValid}
					onClick={() => {
						setScreenerAnswers(_answers);
						setScreenerTimestamp(new Date().toISOString());

						if (
							_answers.age === "no" ||
							_answers.inUSA === "no" ||
							_answers.redditUsage === "never"
						) {
							setPhase("GOODBYE");
						} else {
							setPhase("FEED");
						}
					}}
				>
					Submit
				</button>
			</div>
		</div>
	);
};
