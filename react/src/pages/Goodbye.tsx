import { useContext } from "react";
import { SurveyContext } from "../contexts";
import { Body, Email, Header } from "../components/general";

export default function Goodbye() {
	const {
		participantID,
		consentTimestamp,
		answers,
		feeds,
		rotations,
		screenerAnswers,
		screenerTimestamp,
		exitAnswers,
		exitTimestamp,
	} = useContext(SurveyContext);

	const jsonData = {
		participantID: participantID,
		consentTimestamp: consentTimestamp,
		feeds: feeds,
		screenerAnswers: screenerAnswers,
		screenerTimestamp: screenerTimestamp,
		exitAnswers: exitAnswers,
		exitTimestamp: exitTimestamp,
		rotations: rotations,
		answers: answers,
	};

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px] gap-2 items-start">
				<Header>Thank you for participating!</Header>
				<Body>
					Your responses have been recorded. If you have any questions or need
					further information, please email Jackie Chan (
					<Email>jackiec3@illinois.edu</Email>).
				</Body>
				<Body>Have a great day!</Body>
				<div className="relative w-full">
					<textarea
						className="h-[500px] w-full p-2 font-mono text-[6pt] bg-gray-100 border border-gray-300 rounded resize-none"
						value={JSON.stringify(jsonData, null, 4)}
						readOnly
					/>
					<button
						className="absolute top-2 right-6 px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
						onClick={() =>
							navigator.clipboard.writeText(JSON.stringify(jsonData, null, 4))
						}
					>
						Copy
					</button>
				</div>
			</div>
		</div>
	);
}
