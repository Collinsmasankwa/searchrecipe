// noinspection JSUnresolvedReference,DuplicatedCode
// get details of the recipe, basic info

export default async (req, res) => {
    try {
        const { query } = req;
        const { recipeId } = query;
        // eslint-disable-next-line no-undef
        const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
        const spoonacularUrl = `https://api.spoonacular.com/recipes`;

        const response = await fetch(
            spoonacularUrl+`/${recipeId}/information?apiKey=${spoonacularApiKey}`);
        const data = await response.json();

        // print out remaining points for requests to spoonacular api -> we are on free version 150 points per day
        console.log('X-API-Quota-Left', response.headers.get('X-API-Quota-Left'))

        res.status(200).json(data); // send data to client
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}