// noinspection JSValidateTypes,JSCheckFunctionSignatures,JSIgnoredPromiseFromCall,JSUnresolvedReference

import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner.jsx";
import {useRecipe} from "../contexts/RecipeContext.jsx";


function RecipeDetails() {
    const { id: recipeId } = useParams();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    let [loading, setLoading] = useState(false);
    const [readyInMinutes, setReadyInMinutes] = useState(null);
    const [cookingMinutes, setCookingMinutes] = useState(null);
    const [preparationMinutes, setPreparationMinutes] = useState(null);
    const {
        currentRecipeStatus, saveRecipe, removeRecipe, scrollDetailsPosition, setScrollDetailsPosition
    } = useRecipe();
    const [displayBriefIntro, setDisplayBriefIntro] = useState(false);


    useEffect(()=>{
        if (preparationMinutes != null || cookingMinutes != null || readyInMinutes != null){
            setDisplayBriefIntro(true);
        }
    }, [cookingMinutes, preparationMinutes, readyInMinutes]);

    // scroll to the top each time we are at this page
    useEffect(()=>{
        window.scrollTo(0, 0);
    }, []);


    // get recipe details
    useEffect(() => {
        let fetchRecipeDetails = async ()=>{

            setLoading(true);

            try {
                // get info about the recipe
                // keys we need, readyInMinutes, cookingMinutes, preparationMinutes, title, image
                let response = await axios.get(
                    `/api/fetchRecipeInfo`, {
                        params: {
                            recipeId
                        }
                    }
                );
                setTitle(response.data.title);
                setImage(response.data.image);
                setPreparationMinutes(response.data.preparationMinutes);
                setReadyInMinutes(response.data.readyInMinutes);
                setCookingMinutes(response.data.cookingMinutes);

                // get recipe cooking instructions plus ingredients
                /*
                *       response is an array with single object with name and steps,
                *       steps is an array of objects with {equipment: object, ingredients: array of obj hence extract name, step: string}
                * */

                let res = await axios.get(
                    `/api/fetchRecipeAnalyzedInfo`, {
                        params: {
                            recipeId
                        }
                    }
                );

                // finalIngredients, used for removal of duplicate ingredients
                const finalIngredients = new Set();

                res.data[0].steps.forEach((step)=>{
                    step.ingredients.forEach(ingredient=>{
                        finalIngredients.add(ingredient.name);
                    });
                });
                setIngredients([...finalIngredients]);
                res.data[0].steps.forEach((step)=>{
                    setInstructions(prevState => [...prevState, step.step]);
                });
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeDetails();
        return ()=>{
            setInstructions([]);
            setIngredients([]);
        }
    }, [recipeId]);

    // scroll to last position before save or remove of recipe from favorites
    useEffect(() => {
        window.scrollTo(0, scrollDetailsPosition);
    }, [scrollDetailsPosition]);

    const onAddRecipeButtonClick = () => {
        if (title.trim().length > 0){
            saveRecipe({
                id: recipeId,
                title: title,
                image: image,
                ingredients: ingredients,
                instructions: instructions,
                preparationMinutes: preparationMinutes,
                cookingMinutes: cookingMinutes,
                readyInMinutes: readyInMinutes
            });
        }
        setScrollDetailsPosition(window.scrollY);
    };

    const onRemoveRecipeButtonClick = () => {
        removeRecipe(recipeId);
        setScrollDetailsPosition(window.scrollY);
    };


    return (
        <>
            <h3 style={{textAlign: 'center'}}>Recipe Information Page</h3>
            {
                loading && <Spinner />
            }
            <div className='recipe-details'>
                <div>
                    <img src={image} draggable='false'  alt='recipe image'/>
                </div>
                {
                    displayBriefIntro &&
                    <div>
                        <h3>Brief Description:</h3>
                        {readyInMinutes && <h3>Ready in minutes: {readyInMinutes} minute(s)</h3>}
                        {preparationMinutes && <h3>Preparation in minutes: {preparationMinutes} minute(s)</h3>}
                        {cookingMinutes && <h3>Cooking in minutes: {cookingMinutes} minute(s)</h3>}
                    </div>
                }
                <div>
                    <h3 className='recipe-card-list-name'>{title}</h3>
                    <h3 style={{color: 'orangered'}}>Ingredients</h3>
                    <ol>
                        {ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                    </ol>
                    <h3 style={{color: 'green'}}>Instructions On How to Cook:</h3>
                    <ol>
                        {instructions.map((instruction, index)=><li key={index}>{instruction}</li>)}
                    </ol>
                </div>
                {/* add to favorites or remove from favorites */}
                <div style={{textAlign: 'center'}}>
                    {
                        currentRecipeStatus ?
                        <button className='btn' onClick={onRemoveRecipeButtonClick} style={{color: 'red'}}>Remove from Favorites</button> :
                        <button className='btn' onClick={onAddRecipeButtonClick}>Add to Favorites</button>
                    }
                </div>
            </div>
        </>
    );
}

export default RecipeDetails;
