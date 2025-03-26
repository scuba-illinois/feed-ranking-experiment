import { useState, createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import chance from "chance";
import { Actions, likertOptions, likertQuestions, Post, Survey } from "./types";
import { posts } from "./posts";
import { formatNumber } from "./utils";

const SurveyContext = createContext<{
	uuid: string;
	debug: boolean;
	setDebug: (debug: boolean) => void;
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
	debug: false,
	setDebug: () => {},
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

function PostCard({ post, position }: { post: Post; position: number }) {
	const {
		selectedPost,
		setSelectedPost,
		completedPosts,
		// postPosition,
		setPostPosition,
	} = useContext(SurveyContext);

	const isSelected = selectedPost === post.uuid;

	return (
		<div
			className={`rounded-md p-4 ${
				isSelected ? "outline-2 outline-blue-500" : "border border-gray-300"
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
		debug,
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
			{debug && (
				<pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
					{JSON.stringify(responses, null, 2)}
				</pre>
			)}
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
	const [debug, setDebug] = useState(false);

	return (
		<SurveyContext.Provider
			value={{
				uuid: uuid,
				debug: debug,
				setDebug: setDebug,
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
			{debug && (
				<div className="p-4 text-[8pt]">
					<p>Completed Posts: {completedPosts.length}</p>
					<p>Selected Post: {selectedPost}</p>
					<pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
						{JSON.stringify(survey, null, 2)}
					</pre>
				</div>
			)}
			<div className="m-3">
				<h1 className="font-bold text-2xl">Trending on Reddit</h1>
				<p className="text-[10pt]">
					To start assessing posts, please click on any post.
				</p>
				<button
					className={`py-2 px-3 rounded-md text-[8pt] transition-colors mt-2 ${
						debug
							? "bg-red-500 text-white hover:bg-red-600"
							: "bg-blue-500 text-white hover:bg-blue-600"
					}`}
					onClick={() => setDebug(!debug)}
				>
					{debug ? "Disable Debug" : "Enable Debug"}
				</button>
			</div>
			<div className="flex justify-center gap-2 m-3">
				<div className="w-1/2 flex flex-col gap-2">
					{posts.map((post, index) => (
						<PostCard key={index} post={post} position={index + 1} />
					))}
				</div>
				{selectedPost && !completedPosts.includes(selectedPost) ? (
					<div className="w-1/2 sticky top-2 self-start flex flex-col gap-1 outline-2 outline-blue-500 rounded-md p-4 text-[8pt]">
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
