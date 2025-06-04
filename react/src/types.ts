export const phases = [
	"intro",
	"instructions",
	"phase1",
	"instructions-2",
	"phase2",
	"transition",
	"phase3",
	"exit-questionnaire",
	"exit",
] as const;

export type Phases = (typeof phases)[number];

export const actions = [
	"share",
	"like",
	"comment",
	"read more",
	"ignore",
] as const;

export type Actions = (typeof actions)[number];

export const likertQuestions = [
	"This post is relevant to me.",
	"This post is trustworthy.",
	"This post is high quality.",
];

export type LikertQuestion = (typeof likertQuestions)[number];

// export const likertOptions = [
// 	"Strongly Disagree",
// 	"Disagree",
// 	"Somewhat Disagree",
// 	"Neutral",
// 	"Somewhat Agree",
// 	"Agree",
// 	"Strongly Agree",
// ] as const
//
export const likertOptions = [1, 2, 3, 4, 5, 6, 7] as const;

export type LikertOption = (typeof likertOptions)[number];

export type Post = {
	uuid: string;
	rank: number;
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

export type Response = {
	actions: string[];
	likert: Record<LikertQuestion, LikertOption>;
	overallQuality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
};

export type InitialPhase = {
	responses: Partial<Record<1 | 2 | 3 | 4 | 5, Response>>;
} | null;

export type FeedPhase = {
	responses: Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, Response>>;
} | null;

export type Survey = {
	participant: string;
	Phase1: InitialPhase;
	Phase2: FeedPhase;
	Phase3: FeedPhase;
};

export type FeedData = {
	uuid: string;
	height: number;
	width: number;
	x: number;
	y: number;
}[];

export type Logs = {
	timestamp: string;
	action: "START" | "SELECT" | "DESELECT" | "END";
	uuid: string;
}[];
