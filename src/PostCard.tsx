import { useContext, useState } from "react";
import { Post } from "./types";
import { formatNumber } from "./utils";
import { PhaseContext } from "./App";

function PostHeader({
	post,
	hideAuthor = false,
}: {
	post: Post;
	hideAuthor?: boolean;
}) {
	const { completedPosts } = useContext(PhaseContext);
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
	const MAX_HEIGHT = "300px";

	if (images.length > 1) {
		const [currentIndex, setCurrentIndex] = useState(0);

		return (
			<div className="relative w-full rounded-md mb-2">
				<img
					src={images[currentIndex]}
					className="w-full rounded-md"
					style={{
						height: "auto",
						maxHeight: MAX_HEIGHT,
						objectFit: "contain",
					}}
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
			style={{ height: "auto", maxHeight: MAX_HEIGHT, objectFit: "contain" }}
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
	const isYouTube =
		videoLink.includes("youtube.com") || videoLink.includes("youtu.be");

	return isYouTube ? (
		<iframe
			src={videoLink}
			title={title}
			className="w-full rounded-md mb-2"
			style={{ aspectRatio: "16/9", minHeight: "300px" }}
			allowFullScreen
			referrerPolicy="strict-origin-when-cross-origin"
		/>
	) : (
		<video
			key={videoLink}
			className="w-full rounded-md mb-2"
			style={{ aspectRatio: "16/9", minHeight: "300px" }} // FIXME: Seems weird to have this fixed.
			autoPlay
			controls
			muted
		>
			<source src={videoLink} type="video/mp4" />
		</video>
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
	// TODO: Make these pills.

	return (
		<div className="flex items-center text-gray-500 text-[8pt] gap-2">
			<span>{formatNumber(upvotes)} upvotes</span>
			<span>{formatNumber(comments)} comments</span>
		</div>
	);
}

export function PostCard({ post }: { post: Post; position?: number }) {
	const { selectedPost, setSelectedPost, completedPosts } =
		useContext(PhaseContext);

	const isSelected = selectedPost === post.uuid;

	return (
		<div
			className={`rounded-md p-4 ${
				isSelected ? "outline-2 outline-blue-500" : "border border-gray-300"
			}`}
			onClick={() => {
				if (!completedPosts.includes(post.uuid)) {
					setSelectedPost(post.uuid);
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
