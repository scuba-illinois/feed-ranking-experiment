import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../contexts";
import { Header, Body, Button } from "../components/general";

export default function Transition() {
	const { setPhase } = useContext(SurveyContext);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsButtonEnabled(true);
		}, 1000);

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-4 w-full max-w-md p-6">
				<Header>First Feed Completed!</Header>
				<Body>
					You have completed assessing your first trending feed. You have one
					more left!
				</Body>

				<Button disabled={!isButtonEnabled} onClick={() => setPhase("phase3")}>
					Continue
				</Button>
			</div>
		</div>
	);
}
