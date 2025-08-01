# Frontend

## Deployment

Some directions on how to deploy this React application.

### Install `node`/`npm`

The directions to install `node` and `npm` are located here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

If installed correctly, you should be able to run the following commands in your terminal:

```
npm -v
node -v
```

These just get the version numbers for each.

### Installing Dependencies

Go to the `./react/` directory and run `npm install`. Running this command should react a `./react/node_modules/` directory that has all the dependencies required to run this project locally.

### Deploy Locally

To deploy locally, run `npm run dev` in the `./react/` directory. That should start a local instance of the frontend. In the terminal, it should tell you which port the application is listening to on `localhost`. Type the URL into your web browser and you should be able to see the interface.

---

## Notes

- The interface sucks for mobile and people who have their web browser really zoomed in.

## TODO

- [ ] Screener questions.
- [ ] Exit questionnaire.
- [ ] Move onto the next section when time expires.
- [ ] Put a better explainer in the popup when rating each post.
- [ ] Another stage that has them rate posts that didn't select.
- [ ] Have them rate multiple feeds.
- [ ] Add directions on how to run this React project.

### Minor

- [ ] There needs some bottom margin on the Consent Form.
- [ ] Right now, they need to pick 3 posts, but it should "at most" 3 posts---i.e., be able to move on with less than 3 posts selected.
- [ ] All participants to edit reviews.
