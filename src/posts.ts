import { Post } from "./types";

// export const posts: Post[] = [
// 	{
// 		uuid: "61f067a3-5eda-4886-b62e-54de07a89c5f",
// 		source:
// 			"https://www.reddit.com/r/pics/comments/1jj1u0f/colorados_painting_of_trump_and_his_official/",
// 		type: "image",
// 		subreddit: "pics",
// 		title: "Colorado's painting of Trump and his official portrait",
// 		upvotes: 60_424,
// 		comments: 5_231,
// 		author: "ptrdo",
// 		images: ["https://u.cubeupload.com/jackiec1998/ae464044b889434d87d8.png"],
// 	},
// 	{
// 		uuid: "d480cfb6-386a-4fd9-b68d-3b3c0af2fd7c",
// 		source:
// 			"https://www.reddit.com/r/AITAH/comments/1ji36pp/aitah_for_embarrassing_my_stepmom_at_dinner_after/",
// 		type: "text",
// 		subreddit: "AITAH",
// 		author: "ImaginaryStop6423",
// 		title:
// 			'AITAH for embarrasing my stepmom at dinner after she tried to "teach me a lesson" about my real mom?',
// 		upvotes: 41_213,
// 		comments: 4_923,
// 		body: `I (18F) live with my dad and my stepmom (43F). My mom passed away when I was 10, and it's still a sensitive subject for me. My stepmom came into the picture a couple of years later, and while we're civil, we're definitely not close.

// She's always had this weird vibe — like she's trying to compete with my mom even though my mom isn't here. She gets snippy when I talk about her or wear anything that belonged to her (like my mom's old necklace I wear basically every day).

// Anyway, a few nights ago, we were out for dinner with my dad, stepmom, and her parents. Her mom asked about the necklace, and I said, “It was my mom's. She gave it to me before she passed. I wear it every day.”

// Stepmom immediately cut in with,

// “Well, technically I'm your mom now. I've done more mothering in the last 8 years than she did in 10.”

// I swear the whole table went silent.

// I just laughed and said,

// “If you think being a mom is about trying to erase the actual one, then yeah, you've been amazing.”

// She looked like she'd been slapped. Her mom gasped. My dad told me to apologize, but I refused. I said I was tired of her acting like my mom never existed, and I wasn't going to play along anymore.

// Now my stepmom is barely speaking to me, and my dad says I “need to be the bigger person” because “she's just trying to connect.”

// But to me, that didn't feel like connection — that felt like erasure.

// AITA for calling her out in front of everyone?
// `,
// 	},
// 	{
// 		uuid: "10b6ba2b-7b1e-4629-b617-2cda96ae893a",
// 		source:
// 			"https://www.reddit.com/r/videos/comments/1jjayj6/ceo_kenneth_lay_told_his_employees_to_buy_more/",
// 		type: "video",
// 		subreddit: "videos",
// 		title:
// 			"CEO Kenneth Lay told his employees to buy more stock during this meeting, 64 Days later Enron Collapsed.",
// 		upvotes: 7_934,
// 		comments: 253,
// 		author: "SillyAlterative420",
// 		videoLink: "https://www.youtube.com/embed/6svTm7zC50w",
// 	},
// 	{
// 		uuid: "8788f895-57d6-46cd-be55-edce5fa84eb2",
// 		source:
// 			"https://www.reddit.com/r/pics/comments/1jh8k04/i_spent_98_hours_drawing_the_audi_rs6_with/",
// 		type: "image",
// 		subreddit: "pics",
// 		title: "I spent 98 hours drawing the Audi RS6 with colored pencils.",
// 		author: "Scherbatyuk",
// 		upvotes: 71_324,
// 		comments: 1_532,
// 		images: [
// 			"https://u.cubeupload.com/jackiec1998/4682dd2ad3f44a318e69.jpg",
// 			"https://u.cubeupload.com/jackiec1998/0fe0a29603154afd8c85.jpg",
// 		],
// 	},
// 	{
// 		uuid: "1389a39c-456b-42c5-af08-5970cbaa3d73",
// 		source:
// 			"https://www.reddit.com/r/news/comments/1jjom7u/as_top_trump_aides_sent_texts_on_signal_flight/",
// 		type: "link",
// 		subreddit: "news",
// 		title:
// 			"As top Trump aides sent texts on Signal, flight data show a member of the group chat was in Russia",
// 		author: "evissimus",
// 		upvotes: 6_796,
// 		comments: 221,
// 		link: "https://www.cbsnews.com/news/trump-envoy-steve-witkoff-signal-text-group-chat-russia-putin/",
// 		linkThumbnail:
// 			"https://u.cubeupload.com/jackiec1998/5dea4b099455462f8cb6.png",
// 	},
// ];

export const snapshots: Record<string, { utc: number; posts: Post[] }> = {
	"625a57f7-6ec1-47e7-bbf0-0e4edbad412e": {
		utc: 1743191444,
		posts: [
			{
				author: "T-CupDog",
				subreddit: "me_irl",
				rank: 1,
				comments: 272,
				upvotes: 22538,
				uuid: "bccfdb6b-b689-42bb-a878-736bda4e6104",
				source: "https://reddit.com/r/me_irl/comments/1jlz5ut/me_irl/",
				images: ["bccfdb6b-b689-42bb-a878-736bda4e6104.jpeg"],
				type: "image",
				title: "me_irl",
			},
			{
				uuid: "39f1c84b-1fb5-40ec-8c7e-7b6961e042b5",
				rank: 2,
				source:
					"https://reddit.com/r/AskReddit/comments/1jltwpz/what_is_something_more_traumatizing_than_people/",
				type: "text",
				subreddit: "AskReddit",
				title: "What is something more traumatizing than people realize?",
				author: "ExcellentReporter392",
				upvotes: 3_651,
				comments: 4_398,
			},
			{
				uuid: "f9bb5532-6d95-4c0b-936e-868b29e9881c",
				rank: 3,
				source:
					"https://reddit.com/r/interestingasfuck/comments/1jlye0l/jeff_bezos_built_a_fence_on_his_property_that/",
				type: "video",
				videoLink: "f9bb5532-6d95-4c0b-936e-868b29e9881c.mp4",
				subreddit: "interestingasfuck",
				title:
					"Jeff Bezos built a fence on his property that exceeds the permitted height, he doesn't care, he pays fines every month",
				author: "Gankpa",
				upvotes: 41_377,
				comments: 5_616,
			},
			{
				uuid: "ff1e4ce6-6c6b-4c50-9003-64b82da0852c",
				rank: 4,
				source:
					"https://reddit.com/r/worldnews/comments/1jljj7c/trump_says_us_will_go_as_far_as_we_have_to_to_get/",
				type: "link",
				subreddit: "worldnews",
				link: "https://abcnews.go.com/International/trump-us-control-greenland/story?id=120208823",
				linkThumbnail: "ff1e4ce6-6c6b-4c50-9003-64b82da0852c.png",
				title:
					"Trump says US will 'go as far as we have to' to get control of Greenland",
				author: "EUstrongerthanUS",
				upvotes: 20_317,
				comments: 3_291,
			},
			{
				uuid: "ca39b08d-0574-47b5-9b98-70a4241556bb",
				rank: 5,
				source:
					"https://reddit.com/r/MadeMeSmile/comments/1jlyj5y/when_you_lie_on_your_resum%C3%A9_but_get_the_job_anyway/",
				type: "video",
				videoLink: "ca39b08d-0574-47b5-9b98-70a4241556bb.mp4",
				subreddit: "MadeMeSmile",
				title: "When you lie on your resumé, but get the job anyway",
				author: "ExactlySorta",
				upvotes: 25_669,
				comments: 317,
			},
			{
				uuid: "1cfaa7e0-2fc3-4864-9e7c-7708e1c72bcb",
				rank: 6,
				source:
					"https://reddit.com/r/WallStreetbetsELITE/comments/1jlxyvs/thanks/",
				type: "image",
				subreddit: "WallStreetbetsELITE",
				images: ["1cfaa7e0-2fc3-4864-9e7c-7708e1c72bcb.jpeg"],
				title: "Thanks!🤣",
				author: "Tripleawge",
				upvotes: 27_118,
				comments: 381,
			},
			{
				uuid: "c4c9eaf5-3020-4ee9-95d4-1d0d631e7136",
				rank: 7,
				source: "https://reddit.com/r/meirl/comments/1jly2eq/meirl/",
				type: "image",
				images: ["c4c9eaf5-3020-4ee9-95d4-1d0d631e7136.webp"],
				subreddit: "me_irl",
				title: "meurl",
				author: "themajkisek",
				upvotes: 29_475,
				comments: 487,
			},
			{
				uuid: "0ff50951-8374-4ba8-abbd-4eb384e858bd",
				rank: 8,
				source:
					"https://reddit.com/r/mildlyinteresting/comments/1jlxhfv/my_dad_and_his_friends_overplanned_airport/",
				images: ["0ff50951-8374-4ba8-abbd-4eb384e858bd.webp"],
				type: "image",
				subreddit: "mildlyinteretsing",

				title: "My dad and his friend's over-planned airport carpool schedule",
				author: "moderatelykool",
				upvotes: 35_490,
				comments: 2_803,
			},
			{
				uuid: "273fbb94-f8fc-4b40-9d9f-e4e937598e70",
				rank: 9,
				source:
					"https://reddit.com/r/todayilearned/comments/1jm16a1/til_that_while_filming_john_wick_4_keanu_reeves/",
				type: "link",
				link: "https://www.esquire.com/entertainment/movies/a43478861/keanu-reeves-john-wick-chapter-4-stunt-crew-gifts/",
				linkThumbnail: "273fbb94-f8fc-4b40-9d9f-e4e937598e70.jpg",
				subreddit: "todayilearned",
				title:
					'TIL that while filming John Wick 4, Keanu Reeves gifted stunt performers customized T-shirts showing how many times they "died" in the film, with some dying over 20 times. His personal team of stuntmen also received custom Rolex Submariner watches after filming, as a token of appreciation.',
				author: "Icy_Smoke_733",
				upvotes: 11_712,
				comments: 185,
			},
			{
				uuid: "4267f98b-df5c-4c23-b6a7-c20f091b4588",
				rank: 10,
				source:
					"https://reddit.com/r/Economics/comments/1jllf94/trump_warned_us_automakers_not_to_raise_prices_in/",
				type: "link",
				link: "https://www.wsj.com/business/autos/trump-tariffs-automaker-prices-warning-928bc7a9?st=T7EERK&reflink=desktopwebshare_permalink",
				linkThumbnail: "4267f98b-df5c-4c23-b6a7-c20f091b4588.webp",
				subreddit: "Economics",
				title:
					"Trump Warned U.S. Automakers Not to Raise Prices in Response to Tariffs",
				author: "DomesticErrorist22",
				upvotes: 12_474,
				comments: 2_604,
			},
		],
	},
	"9591ff0b-7c31-42bd-b7ea-f6851ada90a8": {
		utc: 1743199526,
		posts: [
			{
				uuid: "1e903206-fe1e-443a-bb32-c52820b8bb7b",
				rank: 1,
				source:
					"https://reddit.com/r/canada/comments/1jlxngf/trump_thanks_carney_after_extremely_productive/",
				type: "link",
				link: "https://www.ctvnews.ca/federal-election-2025/article/trump-says-things-are-going-to-work-out-between-canada-and-us-in-trade-war-live-updates-here/",
				linkThumbnail: "1e903206-fe1e-443a-bb32-c52820b8bb7b.jpg",
				subreddit: "canada",
				title: "Trump thanks Carney after 'extremely productive' call",
				author: "KylenV14",
				upvotes: 6_544,
				comments: 2_122,
			},
			{
				rank: 2,
				uuid: "38b663ab-50e1-47f3-b4c1-ed7daa94aba3",
				source:
					"https://reddit.com/r/news/comments/1jm02d0/dow_sinks_more_than_600_points_stocks_are_on/",
				linkThumbnail: "38b663ab-50e1-47f3-b4c1-ed7daa94aba3.webp",
				link: "https://www.cnn.com/2025/03/28/investing/us-stocks-tariff-uncertainty-volatility",
				type: "link",
				subreddit: "news",
				title:
					"Dow sinks more than 600 points. Stocks are on track for their worst quarter since 2023",
				author: "Trevor_Lewis",
				upvotes: 14_707,
				comments: 1_175,
			},
			{
				uuid: "fa5551c1-141e-4bfd-b0af-ed1576bb1cbe",
				rank: 3,
				source:
					"https://reddit.com/r/aww/comments/1jm0vyt/oh_my_heart_just_melts_every_morning/",
				type: "video",
				videoLink: "fa5551c1-141e-4bfd-b0af-ed1576bb1cbe.mp4",
				subreddit: "aww",
				title: "Oh my heart just melts every morning",
				author: "Lordwarrior_",
				upvotes: 12_292,
				comments: 101,
			},
			{
				uuid: "db41796c-0a22-4a78-a27b-9d2f47fd50a2",
				rank: 4,
				source:
					"https://reddit.com/r/worldnews/comments/1jlsu4m/putin_vows_to_finish_off_ukraine_and_mocks_size/",
				type: "link",
				link: "https://www.lbc.co.uk/world-news/putin-finish-off-ukraine-mocks-size-british-army/",
				linkThumbnail: "db41796c-0a22-4a78-a27b-9d2f47fd50a2.jpg",
				subreddit: "worldnews",
				title:
					"Putin vows to 'finish off' Ukraine' and mocks size of British army after 'reassurance force' announced",
				author: "Aks_2497",
				upvotes: 28_436,
				comments: 2_002,
			},
			{
				uuid: "4edd97aa-6cd0-4452-abaa-c82136e845cb",
				rank: 5,
				source:
					"https://reddit.com/r/PeterExplainsTheJoke/comments/1jlsuh7/peter/",
				type: "image",
				images: ["4edd97aa-6cd0-4452-abaa-c82136e845cb.jpeg"],
				subreddit: "PeterExplainsTheJoke",
				title: "Peter ?",
				author: "Living-Tomorrow5206",
				upvotes: 11_460,
				comments: 1_996,
			},
			{
				uuid: "b62d0936-5587-4a66-8dd2-357b38199702",
				rank: 6,
				source:
					"https://reddit.com/r/pics/comments/1jlyihf/pentagon_police_in_unmarked_vehicles_rounding_up/",
				type: "image",
				images: ["b62d0936-5587-4a66-8dd2-357b38199702.webp"],
				subreddit: "pics",
				title:
					"Pentagon police in unmarked vehicles rounding up immigrants (Arlington, VA)",
				author: "picklerick8879",
				upvotes: 24_470,
				comments: 1_917,
			},
			{
				uuid: "ca00a989-13d7-4e7a-9332-6d72047ea798",
				rank: 7,
				source:
					"https://reddit.com/r/BikiniBottomTwitter/comments/1jlxxjl/receipts/",
				type: "image",
				images: ["ca00a989-13d7-4e7a-9332-6d72047ea798.png"],
				subreddit: "BikiniBottomTwitter",
				title: "Receipts",
				author: "IAmAccutane",
				upvotes: 33_025,
				comments: 664,
			},
			{
				uuid: "2c146f45-0e63-416c-b22f-5c08b79a1773",
				rank: 8,
				source:
					"https://reddit.com/r/UtterlyUniquePhotos/comments/1jlr3su/freddie_mercury_having_a_sleepover_with_some/",
				type: "image",
				subreddit: "UtterlyUniquePhotos",
				images: ["2c146f45-0e63-416c-b22f-5c08b79a1773.jpeg"],
				title:
					"Freddie Mercury having a sleepover with some close friends. Circa 1980",
				author: "dannydutch1",
				upvotes: 21_036,
				comments: 1_748,
			},
			{
				uuid: "3ebc5838-c0be-4c13-aaf8-c27128351df1",
				rank: 9,
				source:
					"https://reddit.com/r/london/comments/1jls1yk/a_heiling_elon_musk_with_the_us_presidential_seal/",
				type: "video",
				subreddit: "london",
				videoLink: "3ebc5838-c0be-4c13-aaf8-c27128351df1.mp4",
				title:
					"A heiling Elon Musk, with the US Presidential Seal attached to chargers at the Tesla Centre in Tottenham",
				author: "CorleoneBaloney",
				upvotes: 41_138,
				comments: 1_630,
			},
			{
				uuid: "adb8fecc-5de9-48ac-acc8-557dd6f92e9e",
				rank: 10,
				source:
					"https://reddit.com/r/mildlyinfuriating/comments/1jlzypc/instagram_just_casually_recommending_the_woman_my/",
				type: "image",
				images: ["adb8fecc-5de9-48ac-acc8-557dd6f92e9e.webp"],
				subreddit: "mildlyinfuriating",
				title:
					"instagram just casually recommending the woman my dad cheated on my mom with",
				author: "crunchybobs",
				upvotes: 15_878,
				comments: 746,
			},
		],
	},
	"a79d7ea5-5160-479e-80aa-1b274ccce342": {
		utc: 1743200871,
		posts: [
			{
				uuid: "21e6756d-67f6-4a0c-90e8-1ef70c6935e3",
				rank: 1,
				source:
					"https://reddit.com/r/WorkReform/comments/1jm0a4c/taxing_the_rich/",
				type: "image",
				images: ["21e6756d-67f6-4a0c-90e8-1ef70c6935e3.webp"],
				subreddit: "WorkReform",
				title: "Taxing the rich",
				author: "Busy-Government-1041",
				upvotes: 10_773,
				comments: 119,
			},
			{
				uuid: "e0a50b52-5dfd-4a8f-92b6-a9b12aa2ae34",
				rank: 2,
				source:
					"https://reddit.com/r/ontario/comments/1jm0rkz/is_this_trend_really_going_to_continue/",
				type: "image",
				images: ["e0a50b52-5dfd-4a8f-92b6-a9b12aa2ae34.webp"],
				subreddit: "ontario",
				title: "Is this trend really going to continue?",
				author: "BoneSetterDC",
				upvotes: 3_968,
				comments: 1_400,
			},
			{
				uuid: "b0e61ad4-6127-49d2-a2fe-56fbcfd0fa94",
				rank: 3,
				source:
					"https://reddit.com/r/memes/comments/1jm0j85/science_memes_day/",
				type: "image",
				images: ["b0e61ad4-6127-49d2-a2fe-56fbcfd0fa94.webp"],
				subreddit: "memes",
				title: "Science memes day",
				author: "gauravmridul",
				upvotes: 13_749,
				comments: 265,
			},
			{
				uuid: "0074373b-6c4b-407a-9f29-e3f5ee0e1ffc",
				rank: 4,
				source:
					"https://reddit.com/r/gaming/comments/1jlurn7/little_surprise_announcement_on_the_nintendo/",
				type: "image",
				images: ["0074373b-6c4b-407a-9f29-e3f5ee0e1ffc.webp"],
				subreddit: "gaming",
				title: "Little surprise announcement on the Nintendo today app",
				author: "Rosscovich",
				upvotes: 14_615,
				comments: 1_361,
			},
			{
				uuid: "4e16ad74-bccf-48da-91c4-071f67a52230",
				rank: 5,
				source:
					"https://reddit.com/r/zelda/comments/1jlzwcn/movie_you_cant_tell_me_hunter_schafer_isnt_the/",
				type: "image",
				images: [
					"4e16ad74-bccf-48da-91c4-071f67a52230-1.webp",
					"4e16ad74-bccf-48da-91c4-071f67a52230-2.webp",
					"4e16ad74-bccf-48da-91c4-071f67a52230-3.webp",
				],
				subreddit: "zelda",
				title:
					"[Movie] You can't tell me Hunter Schafer isn't the perfect casting for Zelda",
				author: "Replikante",
				upvotes: 6_366,
				comments: 1_361,
			},
			{
				uuid: "8b5ef4a4-74c4-4dd0-8b20-f8730d83b026",
				rank: 6,
				source:
					"https://reddit.com/r/BlackPeopleTwitter/comments/1jm1nk7/how_you_fumble_the_land_of_maple_syrup_and/",
				type: "image",
				images: ["8b5ef4a4-74c4-4dd0-8b20-f8730d83b026.webp"],
				subreddit: "BlackPeopleTwitter",
				title: "How you fumble the land of maple syrup and friendly folk?!?",
				author: "Cleonce12",
				upvotes: 8_113,
				comments: 421,
			},
			{
				uuid: "c8a18c2e-14de-48f4-bce4-ffafd2bdf850",
				rank: 7,
				source:
					"https://www.reddit.com/r/Fauxmoi/comments/1jm23uu/macklemore_on_why_he_wont_stop_speaking_up_for/",
				type: "video",
				subreddit: "Fauxmoi",
				title: "Macklemore on why he won't stop speaking up for Palestine",
				videoLink: "c8a18c2e-14de-48f4-bce4-ffafd2bdf850.mp4",
				author: "Particular_Log_3594",
				upvotes: 7_628,
				comments: 166,
			},
			{
				uuid: "680055d9-45b0-4192-9f1b-c55749e636f2",
				rank: 8,
				source:
					"https://reddit.com/r/SipsTea/comments/1jlssxw/a_strong_female_lead/",
				type: "video",
				subreddit: "SipsTea",
				videoLink: "680055d9-45b0-4192-9f1b-c55749e636f2.mp4",
				title: "A strong female lead",
				author: "-Six_",
				upvotes: 41_857,
				comments: 1_301,
			},
			{
				uuid: "a62dbfec-b6ac-4028-a4fe-1c007127e203",
				rank: 9,
				source:
					"https://reddit.com/r/technology/comments/1jlzcc0/car_prices_could_jump_6000_as_trumps_25_import/",
				type: "link",
				link: "https://www.techspot.com/news/107330-car-prices-could-jump-6000-trump-25-import.html",
				linkThumbnail: "a62dbfec-b6ac-4028-a4fe-1c007127e203.webp",
				subreddit: "technology",
				title:
					"Car prices could jump $6,000 as Trump's 25% import tariff kicks in | Brace for higher car prices",
				author: "chrisdh79",
				upvotes: 14_811,
				comments: 1_636,
			},
			{
				uuid: "df09ef85-87e1-42c8-a664-dbaf807b5266",
				rank: 10,
				source:
					"https://reddit.com/r/moviecritic/comments/1jlvgqi/yikes_thats_tough/",
				type: "image",
				images: ["df09ef85-87e1-42c8-a664-dbaf807b5266.webp"],
				subreddit: "moviecritic",
				title: "Yikes, that's tough",
				author: "JuniorPlastic3562",
				upvotes: 11_064,
				comments: 1_610,
			},
		],
	},
};
