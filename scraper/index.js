import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";

function rotateDown(arr, n) {
	const len = arr.length;
	const offset = ((n % len) + len) % len;
	return arr.slice(-offset).concat(arr.slice(0, -offset));
}

const proofUUIDs = Array.from({ length: 10 }, () => String(uuid()));
const noProofUUIDs = Array.from({ length: 10 }, () => String(uuid()));

const meta = {
	timestamp: new Date().toISOString(),
	snapshotUUID: String(uuid()),
	feeds: Array.from({ length: 10 }, (_, idx) => idx).reduce(
		(dict, rotation) => {
			dict[rotation] = {
				proof: {
					feedUUID: String(uuid()),
					posts: rotateDown(proofUUIDs, rotation),
					articleBounds: [],
				},
				noProof: {
					feedUUID: String(uuid()),
					posts: rotateDown(noProofUUIDs, rotation),
					articleBounds: [],
				},
			};
			return dict;
		},
		{}
	),
};

puppeteer.use(StealthPlugin());

const toggleProof = async (page, disable = true) => {
	await page.evaluate((disable) => {
		document
			.querySelectorAll("shreddit-feed > article > shreddit-post")
			.forEach((article) => {
				article.shadowRoot.querySelector(
					"div.shreddit-post-container"
				).style.display = disable ? "none" : "";
			});
	}, disable);
};

// Create the directory.
const outDir = `./data/${meta.snapshotUUID}/`;
await fs.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
	headless: "new",
});
const page = await browser.newPage();

await page.setUserAgent(
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
);

// Use light mode.
await page.emulateMediaFeatures([
	{ name: "prefers-color-scheme", value: "light" },
]);

await page.goto("https://www.reddit.com/r/popular/", {
	waitUntil: "domcontentloaded",
});
await page.setViewport({ width: 500, height: 9999, deviceScaleFactor: 2 });

// Sleep for two minutes to allow the feed to load.
await new Promise((resolve) => setTimeout(resolve, 120_000));

// Wait until 10 articles have been loaded.
await page.waitForSelector("shreddit-feed > :nth-child(10 of article)");

// Remove ads.
await page.evaluate(() => {
	document
		.querySelectorAll("shreddit-feed > shreddit-ad-post")
		.forEach((el) => {
			el.nextSibling.remove();
			el.remove();
		});
});

// Screenshot of individual articles
for (let i = 1; i < 11; i++) {
	const article = await page.waitForSelector(
		`shreddit-feed > :nth-child(${i} of article)`
	);

	// Using the UUIDs, name the individual posts appropriately.
	await article.screenshot({
		path: path.join(outDir, `${meta.feeds[0].proof.posts[i - 1]}.jpg`),
	});
}

// Disable proof and do it again.
await toggleProof(page, true);

// Screenshot of individual articles without proof.
for (let i = 1; i < 11; i++) {
	const article = await page.waitForSelector(
		`shreddit-feed > :nth-child(${i} of article)`
	);

	// Using the UUIDs, name the individual posts appropriately.
	await article.screenshot({
		path: path.join(outDir, `${meta.feeds[0].noProof.posts[i - 1]}.jpg`),
	});
}

// Add proof back in.
await toggleProof(page, false);

// Screenshots of rotations
for (let i = 0; i < 10; i++) {
	// Get bounds of each article.
	let articleBounds = [];

	for (let j = 1; j < 11; j++) {
		const article = await page.waitForSelector(
			`shreddit-feed > :nth-child(${j} of article)`
		);
		articleBounds.push({
			...(await article.boundingBox()),
			uuid: meta.feeds[i].proof.posts[j - 1],
		});
	}

	// Save the article bounds to the meta object.
	meta.feeds[i].proof.articleBounds = articleBounds;

	// Take screenshot
	await page.screenshot({
		path: path.join(outDir, `${meta.feeds[i].proof.feedUUID}.jpg`),
	});

	// Do the same thing as above, but with proof disabled.
	await toggleProof(page, true); // DISABLE PROOF

	articleBounds = [];

	for (let j = 1; j < 11; j++) {
		const article = await page.waitForSelector(
			`shreddit-feed > :nth-child(${j} of article)`
		);
		articleBounds.push({
			...(await article.boundingBox()),
			uuid: meta.feeds[i].noProof.posts[j - 1],
		});
	}

	// Save the article bounds to the meta object.
	meta.feeds[i].noProof.articleBounds = articleBounds;

	await page.screenshot({
		path: path.join(outDir, `${meta.feeds[i].noProof.feedUUID}.jpg`),
	});

	await toggleProof(page, false); // ENABLE PROOF

	// Rotate 10th post into 1st rank
	await page.evaluate(() => {
		const n = 10;
		const parent = document.querySelector("shreddit-feed");
		const article = document.querySelectorAll("shreddit-feed > article")[n - 1];
		const hr = article.nextSibling;

		hr.remove();
		article.remove();

		parent.prepend(hr);
		parent.prepend(article);
	});
}

await fs.writeFile(path.join(outDir, "meta.json"), JSON.stringify(meta));

await browser.close();
