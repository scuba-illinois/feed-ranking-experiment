import { useState, createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import chance from "chance";

const actions = ["share", "like", "comment", "read more", "ignore"];

type Actions = (typeof actions)[number];

const likertQuestions = [
	"I consider this post to be well-regarded by others.",
	"I consider this post to be interesting, engaging, or relevant to me.",
	"I consider this post to be correct and reliable.",
];

type LikertQuestion = (typeof likertQuestions)[number];

const likertOptions = [
	"Strongly Disagree",
	"Disagree",
	"Somewhat Disagree",
	"Neutral",
	"Somewhat Agree",
	"Agree",
	"Strongly Agree",
] as const;

type LikertOption = (typeof likertOptions)[number];

type Post = {
	uuid: string;
	source: string;
	type: "text" | "image" | "video" | "link";
	subreddit: string;
	title: string;
	author: string;
	upvotes: number;
	comments: number;
	body?: string;
	images?: string[];
	videoLink?: string;
	link?: string;
	linkThumbnail?: string;
};

type InitialPhase = {
	snapshot: string;
	responses: Partial<
		Record<
			1 | 2 | 3 | 4 | 5,
			{
				postUUID: string;
				actions: Set<Actions>;
				likert: Record<LikertQuestion, LikertOption>;
			}
		>
	>;
} | null;

type FeedPhase = {
	snapshot: string;
	responses: Partial<
		Record<
			1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
			{
				postUUID: string;
				actions: string[];
				likert: Record<LikertQuestion, LikertOption>;
			}
		>
	>;
} | null;

type Survey = {
	participant: string;
	Phase1: InitialPhase;
	Phase2: FeedPhase;
	Phase3: FeedPhase;
};

const SurveyContext = createContext<{
	uuid: string;
	selectedPost: string;
	setSelectedPost: (selectedPost: string) => void;
	completedPosts: string[];
	setCompletedPosts: (completedPosts: string[]) => void;
	survey: Survey;
	setSurvey: (survey: Survey) => void;
	postPosition: number;
	setPostPosition: (postPosition: number) => void;
}>({
	uuid: "",
	selectedPost: "",
	setSelectedPost: () => {},
	completedPosts: [],
	setCompletedPosts: () => {},
	survey: {
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	},
	setSurvey: () => {},
	postPosition: 0,
	setPostPosition: () => {},
});

const posts: Post[] = [
	{
		uuid: "61f067a3-5eda-4886-b62e-54de07a89c5f",
		source:
			"https://www.reddit.com/r/pics/comments/1jj1u0f/colorados_painting_of_trump_and_his_official/",
		type: "image",
		subreddit: "pics",
		title: "Colorado's painting of Trump and his official portrait",
		upvotes: 60_424,
		comments: 5_231,
		author: "ptrdo",
		images: ["https://u.cubeupload.com/jackiec1998/ae464044b889434d87d8.png"],
	},
	{
		uuid: "d480cfb6-386a-4fd9-b68d-3b3c0af2fd7c",
		source:
			"https://www.reddit.com/r/AITAH/comments/1ji36pp/aitah_for_embarrassing_my_stepmom_at_dinner_after/",
		type: "text",
		subreddit: "AITAH",
		author: "ImaginaryStop6423",
		title:
			'AITAH for embarrasing my stepmom at dinner after she tried to "teach me a lesson" about my real mom?',
		upvotes: 41_213,
		comments: 4_923,
		body: `I (18F) live with my dad and my stepmom (43F). My mom passed away when I was 10, and it's still a sensitive subject for me. My stepmom came into the picture a couple of years later, and while we're civil, we're definitely not close.

She's always had this weird vibe — like she's trying to compete with my mom even though my mom isn't here. She gets snippy when I talk about her or wear anything that belonged to her (like my mom's old necklace I wear basically every day).

Anyway, a few nights ago, we were out for dinner with my dad, stepmom, and her parents. Her mom asked about the necklace, and I said, “It was my mom's. She gave it to me before she passed. I wear it every day.”

Stepmom immediately cut in with,

“Well, technically I'm your mom now. I've done more mothering in the last 8 years than she did in 10.”

I swear the whole table went silent.

I just laughed and said,

“If you think being a mom is about trying to erase the actual one, then yeah, you've been amazing.”

She looked like she'd been slapped. Her mom gasped. My dad told me to apologize, but I refused. I said I was tired of her acting like my mom never existed, and I wasn't going to play along anymore.

Now my stepmom is barely speaking to me, and my dad says I “need to be the bigger person” because “she's just trying to connect.”

But to me, that didn't feel like connection — that felt like erasure.

AITA for calling her out in front of everyone?
`,
	},
	{
		uuid: "10b6ba2b-7b1e-4629-b617-2cda96ae893a",
		source:
			"https://www.reddit.com/r/videos/comments/1jjayj6/ceo_kenneth_lay_told_his_employees_to_buy_more/",
		type: "video",
		subreddit: "videos",
		title:
			"CEO Kenneth Lay told his employees to buy more stock during this meeting, 64 Days later Enron Collapsed.",
		upvotes: 7_934,
		comments: 253,
		author: "SillyAlterative420",
		videoLink: "https://www.youtube.com/embed/6svTm7zC50w",
	},
	{
		uuid: "8788f895-57d6-46cd-be55-edce5fa84eb2",
		source:
			"https://www.reddit.com/r/pics/comments/1jh8k04/i_spent_98_hours_drawing_the_audi_rs6_with/",
		type: "image",
		subreddit: "pics",
		title: "I spent 98 hours drawing the Audi RS6 with colored pencils.",
		author: "Scherbatyuk",
		upvotes: 71_324,
		comments: 1_532,
		images: [
			"https://u.cubeupload.com/jackiec1998/4682dd2ad3f44a318e69.jpg",
			"https://u.cubeupload.com/jackiec1998/0fe0a29603154afd8c85.jpg",
		],
	},
	{
		uuid: "1389a39c-456b-42c5-af08-5970cbaa3d73",
		source:
			"https://www.reddit.com/r/news/comments/1jjom7u/as_top_trump_aides_sent_texts_on_signal_flight/",
		type: "link",
		subreddit: "news",
		title:
			"As top Trump aides sent texts on Signal, flight data show a member of the group chat was in Russia",
		author: "evissimus",
		upvotes: 6_796,
		comments: 221,
		link: "https://www.cbsnews.com/news/trump-envoy-steve-witkoff-signal-text-group-chat-russia-putin/",
		linkThumbnail:
			"https://u.cubeupload.com/jackiec1998/5dea4b099455462f8cb6.png",
	},
];

function formatNumber(num: number): string {
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
	if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
	return num.toString();
}

function PostHeader({
	post,
	hideAuthor = false,
}: {
	post: Post;
	hideAuthor?: boolean;
}) {
	const { completedPosts } = useContext(SurveyContext);
	const isCompleted = completedPosts.includes(post.uuid);

	return (
		<div className="text-gray-500 text-[8pt] mb-1 flex justify-between items-center">
			<span>
				r/{post.subreddit} • {!hideAuthor && `Posted by u/${post.author}`}
			</span>
			{isCompleted && (
				<span className="text-green-500 text-[8pt] flex items-center">
					✅ Completed
				</span>
			)}
		</div>
	);
}

function PostTitle({ title }: { title: string }) {
	return <h2 className="text-[10pt] font-bold mb-2">{title}</h2>;
}

function TextPreview({ body }: { body: string }) {
	const [expanded, setExpanded] = useState(false);
	const previewText = body.split("\n").slice(0, 3).join("\n");
	return (
		<div
			className="text-gray-700 text-[8pt] mb-2"
			style={{ whiteSpace: "pre-line" }}
		>
			<p>{expanded ? body : previewText}</p>
			{!expanded && body.split("\n").length > 3 && (
				<button
					onClick={() => setExpanded(true)}
					className="text-blue-500 underline mt-1"
				>
					Read More
				</button>
			)}
			{expanded && (
				<button
					onClick={() => setExpanded(false)}
					className="text-blue-500 underline mt-1"
				>
					Show Less
				</button>
			)}
		</div>
	);
}

function ImagePreview({ images }: { images: string[] }) {
	if (images.length > 1) {
		const [currentIndex, setCurrentIndex] = useState(0);

		return (
			<div className="relative w-full rounded-md mb-2">
				<img
					src={images[currentIndex]}
					className="w-full rounded-md"
					style={{ height: "auto" }}
				/>
				{currentIndex > 0 && (
					<button
						onClick={() => setCurrentIndex(currentIndex - 1)}
						className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white text-[7pt] p-2 rounded-full"
					>
						&lt;
					</button>
				)}
				{currentIndex < images.length - 1 && (
					<button
						onClick={() => setCurrentIndex(currentIndex + 1)}
						className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white text-[7pt] p-2 rounded-full"
					>
						&gt;
					</button>
				)}
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 px-2 py-1.5 rounded-full flex space-x-2">
					{images.map((_, index) => (
						<div
							key={index}
							className={`w-1.5 h-1.5 rounded-full ${
								index === currentIndex ? "bg-white" : "bg-gray-400"
							}`}
						></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<img
			src={images[0]}
			className="w-full rounded-md mb-2"
			style={{ height: "auto" }}
		/>
	);
}

function VideoPreview({
	videoLink,
	title,
}: {
	videoLink: string;
	title: string;
}) {
	// FIXME: iframe is causing code to be unreachable after return statement. Not sure why. It might be Google's fault.

	return (
		<iframe
			src={videoLink}
			title={title}
			className="w-full rounded-md mb-2"
			style={{ aspectRatio: "16/9", height: "auto" }}
			allowFullScreen
			referrerPolicy="strict-origin-when-cross-origin"
		/>
	);
}

function LinkPreview({
	link,
	linkThumbnail,
}: {
	link: string;
	linkThumbnail: string;
}) {
	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="block rounded-md overflow-hidden my-3"
		>
			<img src={linkThumbnail} alt="Thumbnail" className="w-full h-auto" />
			<div className="bg-gray-100 text-blue-500 text-[8pt] py-2 px-2">
				{new URL(link).hostname}
			</div>
		</a>
	);
}

function PostPreview({ post }: { post: Post }) {
	if (post.type === "text" && post.body) {
		return <TextPreview body={post.body} />;
	} else if (post.type === "image" && post.images) {
		return <ImagePreview images={post.images} />;
	} else if (post.type === "video" && post.videoLink) {
		return <VideoPreview videoLink={post.videoLink} title={post.title} />;
	} else if (post.type === "link" && post.link && post.linkThumbnail) {
		return <LinkPreview link={post.link} linkThumbnail={post.linkThumbnail} />;
	}

	return null;
}

function PostEngagement({
	upvotes,
	comments,
}: {
	upvotes: number;
	comments: number;
}) {
	return (
		<div className="flex items-center text-gray-500 text-[8pt] gap-2">
			<span>{formatNumber(upvotes)} upvotes</span>
			<span>{formatNumber(comments)} comments</span>
		</div>
	);
}

function Post({ post, position }: { post: Post; position: number }) {
	const {
		selectedPost,
		setSelectedPost,
		completedPosts,
		postPosition,
		setPostPosition,
	} = useContext(SurveyContext);

	const isSelected = selectedPost === post.uuid;

	return (
		<div
			className={`border rounded-md p-4 ${
				isSelected ? "border-blue-500" : "border-gray-300"
			}`}
			onClick={() => {
				if (!completedPosts.includes(post.uuid)) {
					setSelectedPost(post.uuid);
					setPostPosition(position);
				}
			}}
		>
			<PostHeader post={post} />
			<PostTitle title={post.title} />
			<PostPreview post={post} />
			<PostEngagement upvotes={post.upvotes} comments={post.comments} />
		</div>
	);
}

function PostQuestionnaire({ postUUID }: { postUUID: string }) {
	const {
		selectedPost,
		setSelectedPost,
		completedPosts,
		setCompletedPosts,
		survey,
		setSurvey,
		postPosition,
	} = useContext(SurveyContext);

	const actions: Array<Actions> = [
		...new chance(postUUID).shuffle(["share", "comment", "like", "read more"]),
		"ignore",
	];

	const [responses, setResponses] = useState<{
		actions: string[];
		likert: Record<string, string>;
		overallQuality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
	}>({
		actions: [],
		likert: {},
		overallQuality: null,
	});

	// Clear answers when postUUID changes
	useEffect(() => {
		setResponses({ actions: [], likert: {}, overallQuality: null });
	}, [postUUID]);

	const handleActionChange = (action: string) => {
		setResponses((prev) => {
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

	const handleLikertChange = (question: string, value: string) => {
		setResponses((prev) => ({
			...prev,
			likert: { ...prev.likert, [question]: value },
		}));
	};

	const handleOverallQualityChance = (value: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
		setResponses((prev) => ({
			...prev,
			overallQuality: value,
		}));
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
	const handleSubmit = () => {
		if (completedPosts.includes(selectedPost)) return;

		// Validate answers.
		if (!valid(responses)) {
			alert("Please answer all the questions.");
			return;
		}

		setCompletedPosts([...completedPosts, selectedPost]);
		setSelectedPost("");
		setSurvey({
			...survey,
			Phase2: {
				snapshot: "",
				responses: {
					...survey.Phase2?.responses,
					[postPosition]: {
						postUUID: selectedPost,
						actions: responses.actions,
						likert: responses.likert,
					},
				},
			},
		});
	};

	return (
		<>
			<h2 className="text-[10pt] font-bold mb-2">Survey Questions</h2>
			<span>
				<i>Title of Selected Post:</i>{" "}
				{posts.find((p) => p.uuid === selectedPost)?.title}
			</span>
			<hr className="my-2 border-gray-300" />
			<div>
				<h2 className="font-bold mb-1">
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
			<hr className="my-2 border-gray-300" />
			<div>
				<h2 className="font-bold mb-1">How would you describe this post?</h2>
				{likertQuestions.map((question) => (
					<div key={question} className="mb-4">
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
			<div>
				<h2 className="font-bold mb-1">
					How would you rate the overall quality of this post?
				</h2>
				<div className="mb-4">
					<div className="flex flex-wrap gap-2">
						{[1, 2, 3, 4, 5, 6, 7].map((value) => (
							<label key={value} className="flex items-center gap-2">
								<input
									type="radio"
									name={"Overall Quality"}
									value={value}
									checked={responses.overallQuality === value}
									onChange={() =>
										handleOverallQualityChance(
											value as 1 | 2 | 3 | 4 | 5 | 6 | 7
										)
									}
								/>
								<span className="text-[8pt]">{value}</span>
							</label>
						))}
					</div>
				</div>
			</div>
			<pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
				{JSON.stringify(responses, null, 2)}
			</pre>
			<button
				className={`py-2 px-3 rounded-md text-[8pt] transition-colors mt-2 ${
					valid(responses)
						? "bg-blue-500 text-white hover:bg-blue-600"
						: "bg-gray-300 text-gray-500 cursor-not-allowed"
				}`}
				onClick={handleSubmit}
				disabled={!valid(responses)}
			>
				{valid(responses) ? "Submit" : "Please answer all the questions."}
			</button>
		</>
	);
}

function App() {
	// TODO: Remove the div when the post has been submitted and is contained within the completedPosts array.
	const uuid = uuidv4();

	const [selectedPost, setSelectedPost] = useState("");
	const [postPosition, setPostPosition] = useState(0);
	const [completedPosts, setCompletedPosts] = useState<string[]>([]);
	const [survey, setSurvey] = useState<Survey>({
		participant: "",
		Phase1: null,
		Phase2: null,
		Phase3: null,
	});

	return (
		<SurveyContext.Provider
			value={{
				uuid: uuid,
				selectedPost,
				setSelectedPost,
				completedPosts,
				setCompletedPosts,
				survey,
				setSurvey,
				postPosition,
				setPostPosition,
			}}
		>
			<div className="p-4 text-[8pt]">
				<p>Completed Posts: {completedPosts.length}</p>
				<p>Selected Post: {selectedPost}</p>
				<pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
					{JSON.stringify(survey, null, 2)}
				</pre>
			</div>
			<div className="m-3">
				<h1 className="font-bold text-2xl">Trending on Reddit</h1>
				<p className="text-[10pt]">
					To start assessing posts, please click on any post.
				</p>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					{posts.map((post, index) => (
						<Post key={index} post={post} position={index + 1} />
					))}
				</div>
				{selectedPost && !completedPosts.includes(selectedPost) ? (
					<div className="w-1/2 sticky top-2 self-start flex flex-col gap-1 border border-gray-300 rounded-md p-4 text-[8pt]">
						<PostQuestionnaire postUUID={selectedPost} />
					</div>
				) : (
					<div className="w-1/2"></div>
				)}
			</div>
		</SurveyContext.Provider>
	);
}

export default App;
