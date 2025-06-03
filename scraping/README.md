# Scraping

The `index.js` file launches a web browser and navigates to the r/popular feed on Reddit. On the feed, it screenshots the first 10 posts on the feed as one long PNG file. It also records the position/height of each post to position the buttons on the UI correctly. Without the coordinates for each post on the screenshot, the UI/frontend wouldn't know where to place the buttons because it's just one long screenshot.

To run, use `node index.js`.
