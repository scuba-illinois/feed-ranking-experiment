import { useContext } from "react";
import { SurveyContext } from "../contexts";
import { Body, Header } from "../components/general";

export default function Goodbye() {
	const { survey } = useContext(SurveyContext);

	return (
		<div className="p-4 flex flex-col items-center justify-center min-h-screen">
			<div className="text-left max-w-sm flex flex-col gap-4">
				<Header>Thank you for participating!</Header>
				<Body>
					Your responses have been recorded. If you have any questions or need
					further information, please feel free to reach out.
				</Body>
				<Body>Have a great day!</Body>
				<div className="relative">
					<textarea
						className="h-50 w-full p-2 font-mono text-[6pt] bg-gray-100 border border-gray-300 rounded resize-none"
						value={JSON.stringify(survey, null, 2)}
						readOnly
					/>
					<button
						className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
						onClick={() =>
							navigator.clipboard.writeText(JSON.stringify(survey, null, 2))
						}
					>
						Copy
					</button>
				</div>
			</div>
		</div>
	);
}
