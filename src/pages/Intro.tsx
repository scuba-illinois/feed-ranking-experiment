import { useContext, useState } from "react";
import { SurveyContext } from "../App";
import { Body, Button, Header } from "../components/general";

export default function IntroPhase() {
	const { survey, setSurvey, setPhase } = useContext(SurveyContext);
	const [participantID, setParticipantID] = useState("");

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-3 w-full max-w-sm">
				<Header>Welcome!</Header>
				<Body>
					If you are here to participate in a study, please enter your
					participant ID below.
				</Body>
				<form
					className="flex flex-col gap-3"
					onSubmit={(e) => {
						e.preventDefault();

						// TODO: Validate the participant ID before setting it.
						setSurvey({ ...survey, participant: participantID });

						setPhase("instructions");
					}}
				>
					<input
						type="text"
						placeholder="Enter Participant ID"
						className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10pt]"
						value={participantID}
						onChange={(e) => setParticipantID(e.target.value)}
					/>
					<Button type="submit" disabled={!participantID}>
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
}
