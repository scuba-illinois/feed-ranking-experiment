import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";

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

const snapshotUUID = String(uuid());
let uuids = Array.from({ length: 10 }, () => uuid());
const originalOrdering = [...uuids];

// Create the directory.
const outDir = `./data/${snapshotUUID}/`;
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
		path: path.join(outDir, `${uuids[i - 1]}.jpg`),
	});
}

await toggleProof(page, true);

// Screenshot of individual articles
for (let i = 1; i < 11; i++) {
	const article = await page.waitForSelector(
		`shreddit-feed > :nth-child(${i} of article)`
	);

	// Using the UUIDs, name the individual posts appropriately.
	await article.screenshot({
		path: path.join(outDir, `${uuids[i - 1]}-no-proof.jpg`),
	});
}

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
			uuid: uuids[j - 1],
		});
	}

	// Save the bounds of the articles.
	await fs.writeFile(
		path.join(outDir, `rotation-${i}.json`),
		JSON.stringify(articleBounds)
	);

	// Take screenshot
	await page.screenshot({
		path: path.join(outDir, `rotation-${i}.jpg`),
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
			uuid: uuids[j - 1],
		});
	}

	await fs.writeFile(
		path.join(outDir, `rotation-${i}-no-proof.json`),
		JSON.stringify(articleBounds)
	);

	await page.screenshot({
		path: path.join(outDir, `rotation-${i}-no-proof.jpg`),
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

	// Move the last UUID to the front of the array.
	uuids = [uuids.pop(), ...uuids];
}

await fs.writeFile(
	path.join(outDir, "meta.json"),
	JSON.stringify({
		timestamp: new Date().toISOString(),
		snapshotUUID: snapshotUUID,
		originalOrdering: Object.fromEntries(
			originalOrdering.map((uuid, idx) => [idx + 1, uuid])
		),
	})
);

await browser.close();
