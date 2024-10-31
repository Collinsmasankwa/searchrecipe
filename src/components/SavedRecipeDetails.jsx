// noinspection JSValidateTypes,JSCheckFunctionSignatures,JSIgnoredPromiseFromCall,JSUnresolvedReference

import {useRecipe} from "../contexts/RecipeContext.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";


function SavedRecipeDetails() {
    const {
        removeRecipe, currentSavedRecipe, initializeCurrentSavedRecipe
    } = useRecipe();
    const navigate = useNavigate();
    const [displayRemovalMessage, setDisplayRemovalMessage] = useState(null);
    const [displayBriefIntro, setDisplayBriefIntro] = useState(false);


    // scroll to the top each time we are at this page
    useEffect(()=>{
        window.scrollTo(0, 0);
    });
    
    useEffect(()=>{
        if (currentSavedRecipe.preparationMinutes != null || currentSavedRecipe.cookingMinutes != null ||
            currentSavedRecipe.readyInMinutes != null){
            setDisplayBriefIntro(true);
        }
    }, [currentSavedRecipe.cookingMinutes, currentSavedRecipe.preparationMinutes, currentSavedRecipe.readyInMinutes])


    useEffect(()=>{
        if (!currentSavedRecipe){
            let currentRecipeId = JSON.parse(localStorage.getItem("searchAppRecipesCurrentFavorite"));

            if (currentRecipeId){
                initializeCurrentSavedRecipe(currentRecipeId);
                navigate(`/favorites/details/${currentRecipeId}`);
            } else {
                navigate('/favorites');
            }
        }
    }, [currentSavedRecipe, initializeCurrentSavedRecipe, navigate]);


    const onRemoveRecipeButtonClick = () => {
        removeRecipe(currentSavedRecipe.id);
        // navigate back to favorites section
        setDisplayRemovalMessage("Recipe removed from Favorites");
        setTimeout(()=>{
            navigate('/favorites');
            setDisplayRemovalMessage(null);
        }, 2000);
    };


    return (
        <>
            {displayRemovalMessage &&
                <h3 style={{margin: '70px', textAlign: 'center', color: 'green'}}>
                    {displayRemovalMessage}
                </h3>
            }
            {
                Object.keys(currentSavedRecipe).length > 0 && displayRemovalMessage == null &&
                <div className='recipe-details'>
                    <div>
                        <img src={currentSavedRecipe?.image} draggable='false' alt='recipe image'/>
                    </div>
                    { displayBriefIntro &&
                        <div>
                            <h3>Brief Description:</h3>
                            {currentSavedRecipe?.readyInMinutes && <h3>Ready in minutes: {currentSavedRecipe?.readyInMinutes} minute(s)</h3>}
                            {currentSavedRecipe?.preparationMinutes && <h3>Preparation in minutes: {currentSavedRecipe?.preparationMinutes} minute(s)</h3>}
                            {currentSavedRecipe?.cookingMinutes && <h3>Cooking in minutes: {currentSavedRecipe?.cookingMinutes} minute(s)</h3>}
                        </div>
                    }
                    <div>
                        <h3 className='recipe-card-list-name'>{currentSavedRecipe?.title}</h3>
                        <h3 style={{color: 'orangered'}}>Ingredients</h3>
                        <ol>
                            {currentSavedRecipe?.ingredients?.map((ingredient, index)=><li key={index}>{ingredient}</li>)}
                        </ol>
                        <h3 style={{color: 'green'}}>Instructions On How to Cook:</h3>
                        <ol>
                            {currentSavedRecipe?.instructions?.map((instruction, index)=><li key={index}>{instruction}</li>)}
                        </ol>
                    </div>
                    {/* add to favorites or remove from favorites */}
                    <div style={{textAlign: 'center'}}>
                        <button className='btn' onClick={onRemoveRecipeButtonClick} style={{color: 'red'}}>Remove from Favorites</button>
                    </div>
                </div>
            }
        </>
    );
}

export default SavedRecipeDetails;
