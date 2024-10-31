// serverless function to fetch search data from api-> spoonacular api,
// this is onclick of search button or anything relevant to initiate the search
// noinspection JSUnresolvedReference

export default async (req, res) => {
    try {
        const { query } = req; // Query parameters from the frontend
        const { searchQuery, searchResultsCount } = query; // Destructure individual parameters
        // eslint-disable-next-line no-undef
        const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
        const spoonacularUrl = `https://api.spoonacular.com/recipes/complexSearch/`;

        const response = await fetch(
            spoonacularUrl+`?apiKey=${spoonacularApiKey}&query=${searchQuery}&number=${searchResultsCount}`);
        const data = await response.json();

        // print out remaining points for requests to spoonacular api -> we are on free version 150 points per day
        console.log('X-API-Quota-Left', response.headers.get('X-API-Quota-Left'))

        res.status(200).json(data); // send data to client
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}