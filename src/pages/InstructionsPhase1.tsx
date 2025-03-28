import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../App";
import { Header, Body, Button } from "../components/general";

export default function InstructionsPhase1() {
	const { setPhase } = useContext(SurveyContext);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsButtonEnabled(true);
		}, 4000);

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-4 w-full max-w-md p-6">
				<Header>Task Overview</Header>
				<Body>
					You will be shown five social media posts from Reddit, all of which
					have previously appeared on Reddit's trending feed (r/popular). These
					posts will be presented one at a time and we want to understand how
					you would naturally engage with it if you came across it on a trending
					feed you browse.
				</Body>
				<Body>
					For the purposes of this experiment, do not open Reddit to view these
					posts.
				</Body>
				<Body>
					<span className="font-bold text-black">Content Warning:</span> There
					is the potential that some social media posts included in this study
					may contain profanity or language that some participants may find
					offensive. While we do not intentionally select harmful content,
					trending posts reflect real user interactions and may include strong
					language. If you encounter any content that makes you uncomfortable,
					you are free to discontinue participation at any time.
				</Body>
				<Button disabled={!isButtonEnabled} onClick={() => setPhase("phase1")}>
					Continue
				</Button>
			</div>
		</div>
	);
}
