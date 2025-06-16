import { useContext } from "react";
import { Button, Header } from "../components/general";
import { SurveyContext } from "../contexts";

export const Screeners = () => {
	const { setPhase } = useContext(SurveyContext);

	return (
		<>
			<Header>Screener Questions</Header>
			<Button onClick={() => setPhase("FEED")} children="Continue" />
		</>
	);
};
