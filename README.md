#### Pre-requisites:
- [node/npm](https://nodejs.org/en/)
- [Docker](https://www.docker.com/products/docker-desktop/) to run postgres in isolation

#### Setup:
1. Clone this repository
2. Run `npm install`
3. Make sure [Docker](https://www.docker.com/products/docker-desktop/) is running
4. In one terminal window run `npm run up` to start the postgres server
5. In another terminal window run `npm run setup` to create and seed the database
6. Now you can run `npm run dev` to start working on the app

#### Actions:
- Fix all console errors in the browser
- Fix item saving
- Change the header on the page so the count reflects the actual number of items
- Move initial request to the client using `react-query`, show loading screen while it loads
- Make text in the TODO item required, should throw an error on the server if empty
- Make whole item clickable to toggle a checkbox
- Update `/api/stats` so it returns real data from the database instead of hardcoded, do all aggregations in db using raw SQL
- Feel free to fix/update anything else you see fit

#### Questions (add to the PR description):
- how would you propose to update/change API structure/handler?
- what would you add/change on the frontend?
