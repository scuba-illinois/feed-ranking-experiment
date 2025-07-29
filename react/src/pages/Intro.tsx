import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SurveyContext } from "../contexts";
import { Body, Button, Header, Email } from "../components/general";

const BelowHeader = () => (
	<Body className="flex flex-col gap-2">
		<span>
			<b className="text-black">Principal Investigator (PI) & Title:</b> Dr.
			Eshwar Chandrasekharan, Assistant Professor
		</span>
		<span>
			<b className="text-black">Department & Institution:</b> University of
			Illinois Urbana-Champaign, Siebel School of Computing and Data Science
		</span>
		<span>
			<b className="text-black">Contact Information:</b> (217) 224-8872 or{" "}
			<Email>eshwar@illinois.edu</Email>
		</span>
	</Body>
);

const Background = () => (
	<>
		<Header>Background</Header>
		<Body>
			You are being asked to take part in a paid user study. Before you decide
			it is important for you to understand why the research is being done and
			what it will involve. Please take time to read the following information
			carefully. Please contact us if there is anything that is not clear or if
			you would like more information. Take time to decide whether you want to
			take part in this study.
		</Body>
		<Body>
			This study explores how users perceive trending content on social media,
			focusing specifically on Reddit's trending feed, r/popular. As a
			participant, you will browse past captures of the r/popular feed, choose
			posts you would like to read more about, and rate each post based on its
			relevance, trustworthiness, and content quality. The goal of this research
			is to better understand how trending feeds may influence user perceptions
			across a broad audience. By examining these dynamics, we aim to deepen our
			understanding of how trending feeds shape our judgments of online content.
		</Body>
	</>
);

const StudyProcedure = () => (
	<>
		<Header>Study Procedure</Header>
		<Body>
			This study will take approximately 10 minutes to complete. To participate,
			you will need to visit the provided website, where the experiment will be
			conducted.
		</Body>
		<Body>
			The experiment includes four stages: (1) pre-experiment questions, (2)
			feed experiment, (3) post-experiment questionnaire, and (4) compensation.
			The second stage will take up the majority of your time. During this
			stage, you will be shown three archived screenshots of Reddit's r/popular
			feed. For each screenshot, you will have up to two minutes to browse the
			feed and may select up to three posts you would like to read more about.
			You will then rate each selected post on its relevance, trustworthiness,
			and content quality. After rating your selected posts, you will be shown
			three additional posts that you did not select and asked to rate them
			using the same criteria. Once you complete this process for a screenshot,
			you will move on to the next, continuing until you have completed all
			three.
		</Body>
	</>
);

const IRB = () => (
	<>
		<Header>Institutional Review Board (IRB)</Header>
		<Body>
			If you have any questions about your rights as a research subject,
			including concerns, complaints, or to offer input, you may call the Office
			for the Protection of Research Subjects (OPRS) at (217) 333-2670 or email
			OPRS at irb@illinois.edu. If you would like to complete a brief survey to
			provide OPRS feedback about your experiences as a research subject, please
			follow the link here: https://oprs.research.illinois.edu. You will have
			the option to provide feedback or concerns anonymously or you may provide
			your name and contact information for follow-up purposes.
		</Body>
	</>
);

const Risks = () => (
	<>
		<Header>Risks</Header>
		<Body>
			There are minimal risks associated with participating in this study. You
			will be looking at actual posts that appeared on Reddit's r/popular feed.
			Although we don't anticipate any specific issues, some participants may
			experience mild discomfort when being exposed to potentially problematic
			content that naturally occurs within the r/popular feed. However, this is
			expected to be minimal and similar to what might be encountered by a
			typical Reddit user. There is also a small risk of a breach of
			confidentiality, but every effort will be made to protect your privacy.
			All personal information will be anonymized, and data will be stored
			securely. If at any point you feel uncomfortable, you may withdraw from
			the study without any consequences.
		</Body>
	</>
);

const ParticipationRequirements = () => (
	<>
		<Header>Participation Requirements</Header>
		<Body>
			You may participate in this study if you meet the following requirements:
		</Body>
		<ol className="list-decimal text-[10pt] text-gray-600 ml-10 mb-2">
			<li>Have used Reddit in the past month</li>
			<li>Be 18 years old or older</li>
			<li>Be located in the United States of America (USA)</li>
		</ol>
	</>
);

const ProtectInfo = () => (
	<>
		<Header>How Will The Researchers Protect My Information?</Header>
		<Body>
			All personal data, including your name and any identifiable details, will
			be anonymized and replaced with unique participant codes. Data will be
			stored securely on encrypted devices and accessible only to authorized
			research team members. In any report that we publish, we will not include
			any information that will make it possible to identify a subject. To
			comply with federal regulations, we will retain all records for at least
			five years from the date of this study. Afterward, we will destroy the
			records once the research is complete.
		</Body>
	</>
);

const InfoAccess = () => (
	<>
		<Header>
			Who Will Have Access To The Information Collected During This Research
			Study?
		</Header>
		<Body>
			Efforts will be made to limit the use and disclosure of your personal
			information, including your name, email address, interaction data, and
			audio recordings, to people who need to review this information. We cannot
			promise complete secrecy.
		</Body>
		<Body>
			There are reasons why information about you may be used or seen by other
			people beyond the research team during or after this study. For example,
			University officials, government officials, study funders, auditors, and
			the Institutional Review Board may need access to the study information to
			make sure the study is done in a safe and appropriate manner.
		</Body>
	</>
);

const ContactInfo = () => (
	<>
		<Header>Contact Information</Header>
		<Body>
			If you have questions, complaints, or concerns about this study, you can
			contact the researchers Jackie Chan (<Email>jackiec3@illinois.edu</Email>)
			or Dr. Eshwar Chandrasekharan (<Email>eshwar@illinois.edu</Email>).
		</Body>
	</>
);

const Compensation = () => (
	<>
		<Header>Costs & Compensation</Header>
		<Body>
			You will be compensated $2.50 for participating in this study. The
			compensation will be delivered digitally after the completion of the
			study.
		</Body>
	</>
);

const Consent = () => (
	<>
		<Header>Consent</Header>
		<Body>
			I certify that I have read and understand the above consent form and that
			I am 18 years of age or older. By hitting the "I Consent, Begin Study"
			button below, I indicate my willingness to take part in this study.
		</Body>
		<Body>
			Please print this consent form if you would like to retain a copy for your
			records. The PDF version of this consent form, hosted on Google Docs, is
			found{" "}
			<a
				className="text-blue-600 hover:underline"
				href="https://docs.google.com/document/d/1t-MeyXWf7zZJcpvwBc35QQgQuZtjCS4qhC7yE0dB93A/edit?usp=sharing"
				target="_blank"
				rel="noopener noreferrer"
			>
				here
			</a>
			.
		</Body>
	</>
);

export default function Intro() {
	const {
		setPhase,
		prolific,
		setOptionOrder,
		setProlific,
		setConsentTimestamp,
		setFeeds,
		setFeedURLs,
		setFeedData,
		setPostURLs,
	} = useContext(SurveyContext);

	const [buttonStatus, setButtonStatus] = useState<
		"NOT_READY" | "LOADING" | "READY" | "ERROR"
	>("NOT_READY");
	const [searchParams] = useSearchParams();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setConsentTimestamp(new Date().toISOString());
		setButtonStatus("LOADING");

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 60_000); // 1 minute

		fetch(`https://trending-backend.vercel.app/validate/`, {
			method: "POST",
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				timestamp: new Date().toISOString(),
				PROLIFIC_PID: prolific.PROLIFIC_PID,
				STUDY_ID: prolific.STUDY_ID,
				SESSION_ID: prolific.SESSION_ID,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.valid) {
					setFeeds(data.feeds);
					setFeedURLs(data.feedURLs);
					setFeedData(data.feedData);
					setPostURLs(data.postURLs);
					setOptionOrder({
						likert: data.optionsRandomized.likert,
						selection_multiple_choice:
							data.optionsRandomized.selection_multiple_choice,
						selected_multiple_choice:
							data.optionsRandomized.selected_multiple_choice,
						non_selected_multiple_choice:
							data.optionsRandomized.nonselected_multiple_choice, // BUG: Not sure why I didn't add an underscore.
					});
					setPhase("SCREENER");
				}
			})
			.catch((error) => {
				if (error.name === "AbortError") {
					setButtonStatus("ERROR");
				}
			})
			.finally(() => clearTimeout(timeoutId));
	};

	// Set Prolific information if it's available in the URL parameters.
	// ?PROLIFIC_PID=test&STUDY_ID=test&SESSION_ID=test
	useEffect(() => {
		const PROLIFIC_PID = searchParams.get("PROLIFIC_PID");
		const STUDY_ID = searchParams.get("STUDY_ID");
		const SESSION_ID = searchParams.get("SESSION_ID");

		if (PROLIFIC_PID && STUDY_ID && SESSION_ID) {
			setProlific({
				PROLIFIC_PID,
				STUDY_ID,
				SESSION_ID,
			});
			setButtonStatus("READY");
		}
	}, []);

	return (
		<div className="flex justify-center my-6">
			<div className="flex flex-col w-[560px] gap-2">
				<h1 className="text-2xl font-bold">Welcome!</h1>
				<Body>
					Please take the time to read the consent document before
					participating.
				</Body>
				<Header>Consent Document</Header>
				<BelowHeader />
				<Background />
				<StudyProcedure />
				<IRB />
				<Risks />
				<ParticipationRequirements />
				<ProtectInfo />
				<InfoAccess />
				<ContactInfo />
				<Compensation />
				<hr className="h-px my-4 dark:bg-gray-700"></hr>
				<Consent />

				<form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
					<Button
						type="submit"
						disabled={
							buttonStatus === "LOADING" || buttonStatus === "NOT_READY"
						}
						className={
							buttonStatus === "LOADING"
								? "bg-green-500 hover:bg-green-600 text-white"
								: ""
						}
					>
						{buttonStatus === "LOADING" && "Loading..."}
						{buttonStatus === "NOT_READY" &&
							"Cannot Begin, No Prolific Credentials Found"}
						{buttonStatus === "READY" && "I Consent, Begin Study"}
						{buttonStatus === "ERROR" &&
							"An error occurred. Please refresh and try again."}
					</Button>
				</form>
			</div>
		</div>
	);
}
