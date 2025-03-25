import { useState } from "react";

type Post = {
	source: string;
	type: "text" | "image" | "video" | "link";
	subreddit: string;
	title: string;
	author: string;
	upvotes: number;
	comments: number;
	body?: string;
	image?: string[];
	videoLink?: string;
};

const posts: Post[] = [
	{
		source:
			"https://www.reddit.com/r/pics/comments/1jj1u0f/colorados_painting_of_trump_and_his_official/",
		type: "image",
		subreddit: "pics",
		title: "Colorado's painting of Trump and his official portrait",
		upvotes: 60_424,
		comments: 5_231,
		author: "ptrdo",
		image: ["https://u.cubeupload.com/jackiec1998/ae464044b889434d87d8.png"],
	},
	{
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
		source:
			"https://www.reddit.com/r/pics/comments/1jh8k04/i_spent_98_hours_drawing_the_audi_rs6_with/",
		type: "image",
		subreddit: "pics",
		title: "I spent 98 hours drawing the Audi RS6 with colored pencils.",
		author: "Scherbatyuk",
		upvotes: 71_324,
		comments: 1_532,
		image: [
			"https://u.cubeupload.com/jackiec1998/4682dd2ad3f44a318e69.jpg",
			"https://u.cubeupload.com/jackiec1998/0fe0a29603154afd8c85.jpg",
		],
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
	return (
		<div className="text-gray-500 text-[8pt] mb-1">
			r/{post.subreddit} • {!hideAuthor && `Posted by u/${post.author}`}
		</div>
	);
}

function PostTitle({ title }: { title: string }) {
	return <h2 className="text-[10pt] font-bold mb-2">{title}</h2>;
}

function PostPreview({ post }: { post: Post }) {
	if (post.type === "text" && post.body) {
		const [expanded, setExpanded] = useState(false);
		const previewText = post.body.split("\n").slice(0, 3).join("\n");
		return (
			<div className="text-gray-700 text-[8pt] mb-2">
				<p>{expanded ? post.body : previewText}</p>
				{!expanded && post.body.split("\n").length > 3 && (
					<button
						onClick={() => setExpanded(true)}
						className="text-blue-500 underline mt-1"
					>
						Read more
					</button>
				)}
				{expanded && (
					<button
						onClick={() => setExpanded(false)}
						className="text-blue-500 underline mt-1"
					>
						Show less
					</button>
				)}
			</div>
		);
	} else if (post.type === "image" && post.image) {
		if (post.image.length > 1) {
			const [currentIndex, setCurrentIndex] = useState(0);

			return (
				<div className="relative w-full rounded-md mb-2">
					<img
						src={post.image[currentIndex]}
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
					{currentIndex < post.image.length - 1 && (
						<button
							onClick={() => setCurrentIndex(currentIndex + 1)}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white text-[7pt] p-2 rounded-full"
						>
							&gt;
						</button>
					)}
					<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 px-2 py-1.5 rounded-full flex space-x-2">
						{post.image.map((_, index) => (
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
				src={post.image[0]}
				className="w-full rounded-md mb-2"
				style={{ height: "auto" }}
			/>
		);
	} else if (post.type === "video" && post.videoLink) {
		return (
			<iframe
				src={post.videoLink}
				title={post.title}
				className="w-full rounded-md mb-2"
				style={{ aspectRatio: "16/9", height: "auto" }}
				allowFullScreen
			></iframe>
		);
	}

	return <></>;
}

function PostEngagement({
	upvotes,
	comments,
}: {
	upvotes: number;
	comments: number;
}) {
	return (
		<div className="flex items-center text-gray-500 text-[8pt]">
			<span className="mr-4">{formatNumber(upvotes)} upvotes</span>
			<span>{formatNumber(comments)} comments</span>
		</div>
	);
}

function Post({ post }: { post: Post }) {
	return (
		<div className="border border-gray-300 rounded-md p-4">
			<PostHeader post={post} />
			<PostTitle title={post.title} />
			<PostPreview post={post} />
			<PostEngagement upvotes={post.upvotes} comments={post.comments} />
		</div>
	);
}

function App() {
	return (
		<div className="flex justify-center gap-2 m-3">
			<div className="w-1/2 flex flex-col gap-2">
				{posts.map((post, index) => (
					<Post key={index} post={post} />
				))}
			</div>
			<div className="w-1/2">
				{/* Placeholder for survey questions */}
				<div className="border border-gray-300 rounded-md p-4">
					<h2 className="text-[10pt] font-bold mb-2">Survey Questions</h2>
					<p className="text-gray-500 text-[8pt]">
						Questions will appear here.
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
