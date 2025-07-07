import { Body, Email, Header } from "../components/general";

export default function Unqualified() {
	return (
		<div className="flex justify-center h-[100vh] gap-2 p-4">
			<div className="flex flex-col w-[560px] gap-2 items-start">
				<Header>Thank you for your interest!</Header>
				<Body>
					Based on your responses to the screening questions, you're not
					eligible to participate in this study. We sincerely appreciate your
					time and interest.
				</Body>
				<Body>
					If you have any questions or would like more information, feel free to
					contact Jackie Chan at <Email>jackiec3@illinois.edu</Email>.
				</Body>
			</div>
		</div>
	);
}
