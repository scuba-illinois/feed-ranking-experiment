export type Phase =
	| "CONSENT"
	| "SCREENER"
	| "FEED"
	| "FEEDRATING"
	| "EXIT"
	| "GOODBYE"
	| "UNQUALIFIED";

export type QuestionAnswers = {
	relevance: number;
	quality: number;
	manipulation: number;
};

export type FeedData = {
	uuid: string;
	height: number;
	width: number;
	x: number;
	y: number;
}[];

// TODO: Union discriminator types.
export type SelectionLogs = {
	timestamp: string;
	action: "START" | "SELECT" | "UNSELECT" | "END" | "TIME_EXPIRED";
	uuid?: string;
}[];

export type RatingLogs = {
	timestamp: string;
	action: "RATE" | "SUBMIT" | "OPEN" | "EDIT" | "CLOSE" | "END";
	uuid?: string;
	question?: string;
	rating?: number;
}[];

// There should be 3 keys. Each attribute in the value should be filled out
// throughout the experiment and shouldn't be empty at the end.
export type Answers = Record<
	string, // snapshotUUID
	{
		selectedPosts?: string[];
		nonSelectedPosts?: string[]; // The posts that were not selected by the participant, but still rated.
		selectionLogs?: SelectionLogs;
		ratings?: Record<string, QuestionAnswers>;
		ratingLogs?: RatingLogs;
		selectionStart: string;
		selectionEnd: string;
		selectionDuration: number;
		ratingStart: string;
		ratingEnd: string;
		ratingDuration: number;
	}
>;

export type ExitQuestionnaireAnswers = {
	postSelectionExplained: string;
	selectedPostExplained: string;
	nonSelectedPostExplained: string;
	relevanceExplained: string;
	manipulationExplained: string;
	qualityExplained: string;
	postLikelihood: number;
	selectedPostExample: {
		feedUUID: string;
		postUUID: string;
	};
	nonSelectedPostExample: {
		feedUUID: string;
		postUUID: string;
	};
	ratedPostExample: {
		feedUUID: string;
		postUUID: string;
	};
};

export type Settings = {
	hideSelectionDirections: boolean;
	hideRatingDirections: boolean;
};
