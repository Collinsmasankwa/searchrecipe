// noinspection JSUnresolvedReference,JSIgnoredPromiseFromCall

import SearchRecipe from "./SearchRecipe.jsx";
import {useEffect, useRef, useState} from "react";
import RecipeCard from "./RecipeCard.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecipe} from "../contexts/RecipeContext.jsx";
import Spinner from "./Spinner.jsx";


const SEARCH_RESULTS_COUNT = 5; // initial search results we should get


function Home(){
    let {
        recipes, addToRecipes, scrollPosition, setScrollPosition, searchResultsCount, setSearchResultsCount,
        recipesCount, setRecipesCount, searchquery, setSearchquery, notifyRecipeStatus
    } = useRecipe();
    // searchResultsCount when used we are getting more results
    let navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let initialSearchRequest = useRef(null);    // for initial search request tokens
    let loadMoreSearchRequest = useRef(null);    // for loadMoreSearchRequest tokens
    const [displayFetchErrors, setDisplayFetchErrors] = useState(null);


    const onSearchButtonClick = async (searchQuery) => {
        if (searchQuery.trim().length > 0){
            setLoading(true);
            setDisplayFetchErrors(null);
            searchQuery = searchQuery.trim()

            // cancel the previous request
            if (initialSearchRequest.current){
                initialSearchRequest.current.cancel('cancelled');
            }

            initialSearchRequest.current = axios.CancelToken.source();  // create a token

            // make an axios request to get the recipe
            try{
                let response = await axios.get('/api/fetchSearchData', {
                    params: {
                        searchQuery: searchQuery,
                        searchResultsCount: SEARCH_RESULTS_COUNT,
                    },
                    cancelToken: initialSearchRequest.current.token
                });
                /* response is an object of:
                    {
                         number: number,
                         offset: number,
                         results: Array(object of props-> id: number, image: string, imageType: string, title: string),
                         totalResults: number
                    }
                 */
                addToRecipes(response.data.results);
                setRecipesCount(response.data.totalResults);
                setSearchResultsCount((count)=>count + 5);
            } catch(error){
                if (axios.isCancel(error)){
                    // console.log('token cancelled');
                } else {
                    // console.log(error);
                    setDisplayFetchErrors("An unexpected error occurred, please try again later!");
                }
            } finally {
                setLoading(false);
            }
            setSearchquery(searchQuery.trim());
        } else {
            alert("The search input must not be blank, please enter a recipe!");
        }

    };

    // navigate to recipe details
    const onRecipeListItemClick = (recipeId)=>{
        notifyRecipeStatus(recipeId);
        navigate(`/details/${recipeId}`);
        setScrollPosition(window.scrollY);
    };

    // onLoadMoreRecipesButtonClick
    const onLoadMoreRecipesButtonClick = ()=>{
        // make a request to the server to get more results and display them
        let fetchMoreRecipes = async ()=>{
            // cancel the previous request
            if (loadMoreSearchRequest.current){
                loadMoreSearchRequest.current.cancel('cancelled');
            }

            loadMoreSearchRequest.current = axios.CancelToken.source();  // create a token

            // make an axios request to get more recipes
            if (searchquery.trim().length > 0){
                try{
                    let response = await axios.get('/api/fetchSearchData', {
                        params: {
                            searchQuery: searchquery,
                            searchResultsCount: searchResultsCount,
                        },
                        cancelToken: loadMoreSearchRequest.current.token
                    })
                    /* response is an object of:
                        {
                             number: number,
                             offset: number,
                             results: Array(object of props-> id: number, image: string, imageType: string, title: string),
                             totalResults: number
                        }
                     */
                    addToRecipes(response.data.results);
                    setRecipesCount(response.data.totalResults);
                    setSearchResultsCount(count=>count + 5);
                } catch(error){
                    if (axios.isCancel(error)){
                        // axios token cancellation
                    } else {
                        // console.log(error);
                    }
                }
            }
        }
        fetchMoreRecipes();
    };


    useEffect(()=>{
        window.scrollTo(0, scrollPosition);
    }, [scrollPosition]);



    useEffect(()=>{
        if (displayFetchErrors != null){
            setTimeout(()=>{
                setDisplayFetchErrors(null);
            }, 5000);
        }
    }, [displayFetchErrors]);

    return (
        <>
            {/* SearchRecipe input */}
            <SearchRecipe onSearchButtonClick={onSearchButtonClick}/>

            {/* if no recipes available show default message */}
            {
                recipes.length <= 0 && !loading && displayFetchErrors == null &&
                <div style={{textAlign: "center", fontSize: '1.125em'}}>
                    <p>Welcome to SearchRecipe app, use the search input above and search any recipe in mind!</p>
                    <p>Have a nice cooking time!</p>
                </div>
            }

            {/*show errors from fetching requests*/}
            {
                displayFetchErrors != null &&
                <div style={{textAlign: "center", fontSize: '1.125em', color: 'red'}}>
                    <p>{displayFetchErrors}</p>
                </div>
            }
            {
                loading && <Spinner/>
            }

            {/* if we have recipes */}
            {
                recipes.length > 0 &&
                recipes.map((recipe, index) => {
                    return <RecipeCard title={recipe.title} key={index} image={recipe.image}
                                       onRecipeListItemClick={()=>onRecipeListItemClick(recipe.id)}  />
                })
            }

            {/* recipes.length > 0 < recipesCount, display the load more recipes button */}
            {
                recipes.length > 0 && recipes.length < recipesCount &&
                <button className='btn' style={{color: 'green', margin: '15px'}} onClick={onLoadMoreRecipesButtonClick}>
                    Load more recipes
                </button>
            }
        </>
    );
}

export default Home;
