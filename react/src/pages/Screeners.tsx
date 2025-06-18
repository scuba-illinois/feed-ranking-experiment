import { useContext } from "react";
import { Body, Button, Header } from "../components/general";
import { SurveyContext } from "../contexts";

export const Screeners = () => {
	const { setPhase } = useContext(SurveyContext);

	return (
		<>
			<Header>Screener Questions</Header>
			<Body>
				Please answer the following questions before partaking in this study.
			</Body>
			<Button onClick={() => setPhase("FEED")} children="Continue" />
		</>
	);
};
