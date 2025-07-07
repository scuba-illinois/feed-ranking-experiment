import { useContext } from "react";
import { SurveyContext } from "../contexts";
import { Body, Email, Header } from "../components/general";

export default function Goodbye() {
	const {
		participantID,
		consentTimestamp,
		answers,
		feeds,
		screenerAnswers,
		screenerStart,
		screenerEnd,
		screenerDuration,
		exitAnswers,
		exitStart,
		exitEnd,
		exitDuration,
		totalDuration,
		submitted,
	} = useContext(SurveyContext);

	const jsonData = {
		participantID: participantID,
		consentTimestamp: consentTimestamp,
		feeds: feeds,
		screenerAnswers: screenerAnswers,
		screenerStart: screenerStart,
		screenerEnd: screenerEnd,
		screenerDuration: screenerDuration,
		exitAnswers: exitAnswers,
		exitStart: exitStart,
		exitEnd: exitEnd,
		exitDuration: exitDuration,
		totalDuration: totalDuration,
		answers: answers,
	};

	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px] gap-2 items-start">
				<Header>Thank you for participating!</Header>
				<Body>
					{(() => {
						switch (submitted) {
							case "UNSUBMITTED":
								return "😶 Your data has not been submitted yet.";
							case "PENDING":
								return "🔄 Your data is being submitted.";
							case "SUBMITTED":
								return "✅ Your data has been successfully submitted.";
							case "ERROR":
								return "❌ There was an error submitting your data.";
						}
					})()}{" "}
				</Body>
				<Body>
					If you have any questions or need further information, please email
					Jackie Chan (<Email>jackiec3@illinois.edu</Email>).
				</Body>
				<Body>Have a great day!</Body>
				{/* <DebugInfo /> */}
			</div>
		</div>
	);
}
