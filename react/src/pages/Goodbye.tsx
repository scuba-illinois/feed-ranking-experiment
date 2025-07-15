import { useContext } from "react";
import { SurveyContext } from "../contexts";
import { Body, Email, Header } from "../components/general";

export default function Goodbye() {
	const { submitted, compensation } = useContext(SurveyContext);

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
								return "🔄 Your data is being submitted. Please wait.";
							case "SUBMITTED":
								return "✅ Your data has been successfully submitted.";
							case "ERROR":
								return "❌ There was an error submitting your data.";
						}
					})()}{" "}
				</Body>

				{submitted === "SUBMITTED" && (
					<>
						<Body>
							To be compensated, either copy the confirmation code below or open
							this link:
							<a
								className="text-blue-500 hover:underline"
								href="#"
								target="_blank"
							>
								{compensation.completionURL}
							</a>
						</Body>
						<div className="my-1 flex items-center gap-2 w-full text-[10pt] text-gray-600">
							<input
								type="text"
								value={compensation.completionCode}
								readOnly
								disabled
								className="border rounded-md px-2 py-1 flex-1 bg-gray-300 border-gray-300 cursor-default"
							/>
							<button
								type="button"
								className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
								onClick={async (e) => {
									await navigator.clipboard.writeText(
										compensation.completionCode
									);
									const button = e.target as HTMLButtonElement;
									const originalText = button.innerText;

									button.classList.remove("bg-blue-500");
									button.classList.remove("hover:bg-blue-600");

									button.classList.add("bg-green-500");
									button.classList.add("hover:bg-green-600");

									button.innerText = "Copied!";
									setTimeout(() => {
										button.textContent = originalText!;

										button.classList.remove("bg-green-500");
										button.classList.remove("hover:bg-green-600");

										button.classList.add("bg-blue-500");
										button.classList.add("hover:bg-blue-600");
									}, 1_200);
								}}
							>
								Copy
							</button>
						</div>
					</>
				)}
				<Body>
					If you have any questions or need further information, please email
					Jackie Chan (<Email>jackiec3@illinois.edu</Email>).
				</Body>
				<Body>Have a great day!</Body>
			</div>
		</div>
	);
}
