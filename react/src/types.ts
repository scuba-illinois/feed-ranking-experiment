export type Phase =
	| "CONSENT"
	| "SCREENER"
	| "FEED"
	| "FEEDRATING"
	| "EXITQUESTIONNAIRE"
	| "GOODBYE";

export type QuestionAnswers = {
	"This post is relevant to me": number;
	"This post is interesting": number;
	"This post is informative": number;
};

export type FeedData = {
	uuid: string;
	height: number;
	width: number;
	x: number;
	y: number;
}[];

export type SelectionLogs = {
	timestamp: string;
	action: "START" | "SELECT" | "UNSELECT" | "END";
	uuid: string;
}[];

export type RatingLogs = {
	timestamp: string;
	action: "RATE" | "SUBMIT" | "OPEN" | "EDIT" | "CLOSE";
	uuid: string;
	question?: string;
	rating?: number;
}[];

export type Answers = Record<
	string,
	{
		selectedPosts?: string[];
		nonSelectedPosts?: string[]; // The posts that were not selected by the participant, but still rated.
		selectionLogs?: SelectionLogs;
		ratings?: Record<string, QuestionAnswers>;
		ratingLogs?: RatingLogs;
	}
>;
