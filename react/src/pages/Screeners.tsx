import { JSX, useContext, useEffect, useState } from "react";
import { Body, Header, RedAsterisk } from "../components/general";
import { SurveyContext } from "../contexts";

const INTERESTS = [
	"Anime",
	"Arts",
	"Business",
	"Collectibles & Other Hobbies",
	"Education & Career",
	"Fashion & Beauty",
	"Food & Drink",
	"Games",
	"Home & Garden",
	"Humanities & Law",
	"Internet Culture",
	"Movies & TV",
	"Music",
	"Nature & Outdoors",
	"News & Politics",
	"Places & Travel",
	"Pop Culture",
	"Q&As",
	"Science",
	"Spooky",
	"Sports",
	"Technology",
	"Vehicles",
	"Wellness",
];

const Subreddits = () => {
	const { screenerAnswers, setScreenerAnswers } = useContext(SurveyContext);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		let subreddit = e.currentTarget.value.trim();

		if (subreddit.startsWith("r/")) {
			subreddit = subreddit.slice(2);
		}

		if (
			e.key === "Enter" &&
			subreddit !== "" &&
			(screenerAnswers.subreddits || []).some(
				(s: string) => s.toLowerCase() === subreddit.toLowerCase()
			) === false
		) {
			setScreenerAnswers((state) => ({
				...state,
				subreddits: [...screenerAnswers.subreddits, subreddit],
			}));

			e.currentTarget.value = ""; // Clear the input field after adding
		}
	};

	const handleRemove = (index: number) => {
		setScreenerAnswers((state) => ({
			...state,
			subreddits: [...state.subreddits.filter((_, i) => i !== index)],
		}));
	};

	return (
		<div>
			<input
				type="text"
				onKeyDown={handleKeyDown}
				placeholder="Enter a subreddit"
				className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt]"
			/>
			<ul className="flex flex-col gap-1 mt-2">
				{screenerAnswers.subreddits.map((subreddit, index) => (
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

const Interests = () => {
	const { screenerAnswers, setScreenerAnswers } = useContext(SurveyContext);

	return (
		<div className="flex flex-wrap gap-y-3 gap-x-4">
			{INTERESTS.map((interest) => (
				<label key={interest} className="flex flex-row gap-2">
					<input
						key={interest}
						type="checkbox"
						name="interests"
						value={interest}
						checked={screenerAnswers.interests.includes(interest)}
						onChange={(e) => {
							// If the checkbox is checked, add the interest; otherwise, remove it
							const newInterests = e.target.checked
								? [...screenerAnswers.interests, interest]
								: screenerAnswers.interests.filter(
										(_interest: string) => _interest !== interest
								  );

							// Update the state with the new interest set.
							setScreenerAnswers((state) => ({
								...state,
								interests: [...new Set(newInterests)].sort(),
							}));
						}}
					/>
					<span className="text-[10pt] text-gray-600">{interest} </span>
				</label>
			))}
		</div>
	);
};

export const Screeners = () => {
	const {
		setPhase,
		screenerStart,
		setScreenerStart,
		setScreenerEnd,
		setScreenerDuration,
	} = useContext(SurveyContext);

	useEffect(() => {
		setScreenerStart(new Date().toISOString());
	}, []);

	const [_answers, _setAnswers] = useState<Record<string, any>>({});

	const questions: {
		question: string | JSX.Element;
		component: JSX.Element;
	}[] = [
		{
			question: (
				<span>
					Which of these topics are you generally interested in?{" "}
					<span className="italic">
						Please select all that apply. You must choose at least one.
					</span>
					<RedAsterisk />
				</span>
			),
			component: <Interests />,
		},
		{
			question: (
				<>
					<span>
						List the subreddits you visit most often. Try to list at least five.
					</span>
					<div className="mt-2 pl-5">
						Press "Enter" to add. The subreddits you add will be listed below.
						Do not include the <span className="font-mono">"r/"</span> prefix
						(e.g., use <span className="font-mono">pics</span>, not{" "}
						<span className="font-mono">r/pics</span>). Subreddits are{" "}
						<span className="italic">not case sensitive</span>. Click on{" "}
						<span className="text-red-600">(X)</span> to remove.
					</div>
				</>
			),
			component: <Subreddits />,
		},
	];

	const ContinueButton = () => {
		const { screenerAnswers } = useContext(SurveyContext);

		const valid = screenerAnswers.interests.length > 0;

		const handleClick = () => {
			const screenerEnd = new Date();

			setScreenerEnd(screenerEnd.toISOString());
			setScreenerDuration(
				(screenerEnd.getTime() - new Date(screenerStart).getTime()) / 1_000
			);

			// Determine the next phase based on answers.
			setPhase("FEED");
		};

		return (
			<button
				className={
					"bg-blue-500 text-white rounded-md px-4 py-2 mt-2 w-full text-[10pt] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" +
					(valid ? "" : " opacity-50 cursor-not-allowed")
				}
				onClick={handleClick}
				disabled={!valid}
			>
				Continue
			</button>
		);
	};

	return (
		<div className="flex justify-center my-6">
			<div className="flex flex-col w-[560px] gap-2">
				<Header>Pre-Experiment Questions</Header>
				<Body>
					Please answer the following questions before continuing. Questions
					marked with <RedAsterisk /> are required.
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
				<ContinueButton />
			</div>
		</div>
	);
};
