import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Button } from "../components/general";

export default function InstructionsPhase2() {
	const { setPhase } = useContext(SurveyContext);

	const [isButtonEnabled, setIsButtonEnabled] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsButtonEnabled(true);
		}, 2000);

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-md text-[10pt]">
				<h2 className="text-[12pt] font-bold">Task Overview</h2>
				<p className="text-gray-700">
					During this phase, you will be shown two "snapshots" of Reddit's
					trending feed. As before, we want to understand how you would
					naturally engage with it if you came across it on a trending feed you
					browse.
				</p>
				<p className="text-gray-700">
					For the purposes of this experiment, do not open Reddit to view these
					posts.
				</p>
				<p className="text-gray-700">
					<span className="font-bold">Content Warning:</span> There is the
					potential that some social media posts included in this study may
					contain profanity or language that some participants may find
					offensive. While we do not intentionally select harmful content,
					trending posts reflect real user interactions and may include strong
					language. If you encounter any content that makes you uncomfortable,
					you are free to discontinue participation at any time.
				</p>
				<Button disabled={!isButtonEnabled} onClick={() => setPhase("phase2")}>
					Continue
				</Button>
			</div>
		</div>
	);
}
