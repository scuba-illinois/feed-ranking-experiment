# Scraping

The `index.js` file launches a web browser and navigates to the r/popular feed on Reddit. On the feed, it screenshots the first 10 posts on the feed as one long PNG file. It also records the position/height of each post to position the buttons on the UI correctly. Without the coordinates for each post on the screenshot, the UI/frontend wouldn't know where to place the buttons because it's just one long screenshot.

To run, use `node index.js`.

## TODO

- [ ] Change the names of the files to be shorter.
- [ ] Check if the `y` + `height` of the last post is at the correct position, i.e., flushed at the end of the last post.
