import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";

const date = new Date().toISOString().split(".")[0] + "Z";

const outDir = `./data/${date}/`;
await fs.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.emulateMediaFeatures([
	{ name: "prefers-color-scheme", value: "light" },
]);

await page.goto("https://www.reddit.com/r/popular/");
await page.setViewport({ width: 500, height: 9999, deviceScaleFactor: 2 });

// Wait until 10 articles have been loaded
await page.waitForSelector("shreddit-feed > :nth-child(10 of article)");

// Remove ads
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

	await article.screenshot({
		path: path.join(outDir, `article-${i}.png`),
	});
}

// Screenshots of rotations
for (let i = 0; i < 10; i++) {
	// Get BB of each article
	const articleBounds = [];
	for (let j = 1; j < 11; j++) {
		const article = await page.waitForSelector(
			`shreddit-feed > :nth-child(${j} of article)`
		);
		articleBounds.push(await article.boundingBox());
	}
	await fs.writeFile(
		path.join(outDir, `article-bounds-rot-${i}.json`),
		JSON.stringify(articleBounds)
	);

	// Take screenshot
	await page.screenshot({
		path: path.join(outDir, `full-page-rot-${i}.png`),
	});

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

await browser.close();
