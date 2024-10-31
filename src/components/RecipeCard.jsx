// noinspection NpmUsedModulesInstalled,JSValidateTypes

import proptypes from "prop-types";


function RecipeCard(props) {
    return (
        <>
            {/* recipe list item display */}
            <div className='recipe-card-list' onClick={props.onRecipeListItemClick}>
                <img src={props.image}  alt='recipe image' draggable='false' />&nbsp;&nbsp;
                <div>
                    <h3 className='recipe-card-list-name'>{props.title}</h3>
                    <h3 className='recipe-card-list-view-prompt'>View Recipe</h3>
                </div>
            </div>
        </>
    );
}

RecipeCard.propTypes = {
    onRecipeListItemClick: proptypes.func,
    title: proptypes.string.isRequired,
    image: proptypes.string
}

export default RecipeCard;
