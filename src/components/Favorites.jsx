import {useEffect} from "react";
import {useRecipe} from "../contexts/RecipeContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import {useNavigate} from "react-router-dom";

function Favorites(){
    const {
        savedRecipes, savedRecipesCount, notifyRecipeStatus, savedScrollDetailsPosition, setSavedScrollDetailsPosition,
        initializeCurrentSavedRecipe, setSavedInterimRecipesCount, addToSavedRecipes
    } = useRecipe();
    const navigate = useNavigate();

    // scroll to the top each time we are at this page
    useEffect(()=>{
        window.scrollTo(0, 0);
    });

    useEffect(()=>{
        window.scrollTo(0, savedScrollDetailsPosition);
    }, [savedScrollDetailsPosition]);

    // onRecipeListItemClick
    const onRecipeListItemClick = (recipeId)=>{
        notifyRecipeStatus(recipeId);
        initializeCurrentSavedRecipe(recipeId);
        navigate(`/favorites/details/${recipeId}`);
        setSavedScrollDetailsPosition(window.scrollY);
    };

    // onLoadMoreRecipesButtonClick
    const onLoadMoreRecipesButtonClick = ()=>{
        setSavedInterimRecipesCount(count=>count+5);    // add 5 for next render
        addToSavedRecipes();
        setSavedScrollDetailsPosition(window.scrollY);
    };


    return (
        <>
            <h3 style={{textAlign: 'center'}}>My Favorites</h3>
            {
                savedRecipes.length > 0 ?
                <div className='favorites-div'>
                    {savedRecipes.map((recipe, index) => {
                        return <RecipeCard title={recipe.title} key={index}
                                           image={recipe.image} onRecipeListItemClick={()=>onRecipeListItemClick(recipe.id)} />
                    })}
                    {
                        savedRecipes.length > 0 && savedRecipes.length < savedRecipesCount &&
                        <button className='btn' style={{color: 'green', margin: '15px'}} onClick={onLoadMoreRecipesButtonClick}>
                            Load more favorite recipes
                        </button>
                    }
                </div>
                    :
                <h3 style={{margin: '70px', textAlign: 'center', color: 'red'}}>
                    You currently don&apos;t have any saved recipes,
                    search and add whatever pleases you. <strong style={{color: 'green'}}>Happy Cooking!</strong>
                </h3>
            }
        </>
    );
}

export default Favorites;
