export const actions = ["share", "like", "comment", "read more", "ignore"];

export type Actions = (typeof actions)[number];

export const likertQuestions = [
	"I consider this post to be well-regarded by others.",
	"I consider this post to be interesting, engaging, or relevant to me.",
	"I consider this post to be correct and reliable.",
];

export type LikertQuestion = (typeof likertQuestions)[number];

export const likertOptions = [
	"Strongly Disagree",
	"Disagree",
	"Somewhat Disagree",
	"Neutral",
	"Somewhat Agree",
	"Agree",
	"Strongly Agree",
] as const;

export type LikertOption = (typeof likertOptions)[number];

export type Post = {
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

export type InitialPhase = {
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

export type FeedPhase = {
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

export type Survey = {
	participant: string;
	Phase1: InitialPhase;
	Phase2: FeedPhase;
	Phase3: FeedPhase;
};
