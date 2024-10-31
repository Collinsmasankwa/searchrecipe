// noinspection NpmUsedModulesInstalled

import proptypes from "prop-types";
import {useState} from "react";
import {RecipeContext} from "../contexts/RecipeContext.jsx";


function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState([]);     // will contain objects
    // scroll position of homepage when navigating to recipe details
    const [scrollPosition, setScrollPosition] = useState(0);
    const [searchResultsCount, setSearchResultsCount] = useState(5);
    let [recipesCount, setRecipesCount] = useState(0);
    let [searchquery, setSearchquery] = useState('');
    const [currentRecipeStatus, setCurrentRecipeStatus] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState(
        JSON.parse(localStorage.getItem("searchAppRecipes"))?.slice(0, 5) || []
    );
    // total savedRecipesCount
    const [savedRecipesCount, setSavedRecipesCount] = useState(JSON.parse(localStorage.getItem("searchAppRecipes"))?.length);
    // scroll position of details page when saving or removing recipe from favorites in recipe details
    const [scrollDetailsPosition, setScrollDetailsPosition] = useState(0);
    // scroll position of details page when saving or removing recipe from favorites in saved recipe details
    const [savedScrollDetailsPosition, setSavedScrollDetailsPosition] = useState(0);
    const [currentSavedRecipe, setCurrentSavedRecipe] = useState(null);
    // interim savedRecipes count as we press the more recipes button
    // initial 5 already rendered + 5 for next render
    let [savedInterimRecipesCount, setSavedInterimRecipesCount] = useState(10);

    // initializeCurrentSavedRecipe for view in recipe details for saved one
    const initializeCurrentSavedRecipe = (recipeId) => {
        let savedRecipe = savedRecipes.find((recipe) =>recipe.id === recipeId.toString());
        setCurrentSavedRecipe(savedRecipe);
        // save to localstorage the recipeId, for use during page refresh at the saved recipe section
        window.localStorage.setItem("searchAppRecipesCurrentFavorite", JSON.stringify(recipeId));
    }


    // recipe will be an object, saveRecipe to localstorage
    const saveRecipe = (recipeObj)=>{
        let recipes = JSON.parse(localStorage.getItem("searchAppRecipes")) || [];

        if (!recipes.find(recipe=>recipe.id === recipeObj.id)){
            recipes.push(recipeObj);
            window.localStorage.setItem("searchAppRecipes", JSON.stringify(recipes));
            setSavedRecipesCount(count=>count+1);
            setCurrentRecipeStatus(true);
            setSavedRecipes(JSON.parse(localStorage.getItem("searchAppRecipes"))?.slice(0, 5) || []);
        }
    };

    // recipe will be an object, removeRecipe from localstorage
    const removeRecipe = (recipeId)=>{
        let recipes = JSON.parse(localStorage.getItem("searchAppRecipes")) || [];

        let recipeIndex = recipes.findIndex(recipe=>recipe.id === recipeId.toString()); // for recipe details
        // for favorites
        let savedRecipeIndex = savedRecipes.findIndex(recipe=>recipe.id === recipeId.toString());

        if (recipeIndex !== -1){
            recipes.splice(recipeIndex, 1);
            window.localStorage.setItem("searchAppRecipes", JSON.stringify(recipes));
            setSavedRecipesCount(count=>count-1);
            setCurrentRecipeStatus(false);
            // remove also from savedRecipes list if present
            if (savedRecipeIndex !== -1){
                savedRecipes.splice(savedRecipeIndex, 1);
                setSavedRecipes((prev)=>[...prev]);
            }
        }
    };

    // notify status of the selected recipe whose details are being viewed, check to see if its in local storage or not
    const notifyRecipeStatus = (recipeId)=>{
        let recipes = JSON.parse(localStorage.getItem("searchAppRecipes")) || [];

        if (recipes.find(recipe=>recipe.id === recipeId.toString())){
            setCurrentRecipeStatus(true);
        } else {
            setCurrentRecipeStatus(false);
        }
    };


    // add to recipes list, recipe will be an array of objects.
    // recipe example properties-> id: number, image: string, imageType: string, title: string,
    const addToRecipes = (recipe)=>{
        setRecipes([]);

        recipe.forEach((r)=>{
            if (!recipes.includes(r)){
                setRecipes(prevRecipes=>[...prevRecipes, r]);
            }
        });
    };

    // addToSavedRecipes on click of load more recipes btn
    const addToSavedRecipes = ()=>{
        let allRecipes = JSON.parse(localStorage.getItem("searchAppRecipes")) || [];
        setSavedRecipes(allRecipes.slice(0, savedInterimRecipesCount));
    };


    return (
        <>
            <RecipeContext.Provider value={
                {
                    recipes, addToRecipes, scrollPosition, setScrollPosition, searchResultsCount, setSearchResultsCount,
                    recipesCount, setRecipesCount, searchquery, setSearchquery, currentRecipeStatus, saveRecipe, removeRecipe,
                    notifyRecipeStatus, scrollDetailsPosition, setScrollDetailsPosition, savedRecipes, setSavedRecipes, currentSavedRecipe,
                    initializeCurrentSavedRecipe, savedScrollDetailsPosition, setSavedScrollDetailsPosition,
                    savedRecipesCount, savedInterimRecipesCount, setSavedInterimRecipesCount, addToSavedRecipes
                }
            }>
                {children}
            </RecipeContext.Provider>
        </>
    );
}

RecipeProvider.propTypes = {
    children: proptypes.node,
}


export default RecipeProvider;
