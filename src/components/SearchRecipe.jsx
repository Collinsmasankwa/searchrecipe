// noinspection NpmUsedModulesInstalled

import {useContext, useEffect, useRef, useState} from "react";
import proptypes from "prop-types";
import {RecipeContext} from "../contexts/RecipeContext.jsx";

function SearchRecipe(props) {
    const [searchQuery, setSearchQuery] = useState("");
    let {searchquery} = useContext(RecipeContext);
    let queryInputRef = useRef(null);

    // retain query name on search input if it exists
    useEffect(()=>{
        if (searchquery.trim().length > 0){
            queryInputRef.current.value = searchquery.trim();
        }
    })

    // onSearchInputChange
    const onSearchInputChange = (event)=>{
        setSearchQuery(event.target.value);
    }


    return (
        <>
            {/* search input */}
            <div className="search-recipe-div">
                <input type='search' placeholder='Search any recipe...' value={searchQuery} ref={queryInputRef}
                       onChange={(event)=>onSearchInputChange(event)} />&nbsp;
                <button className='btn' onClick={()=>props.onSearchButtonClick(searchQuery.trim().length > 0 ? searchQuery : searchquery )} type='button'>Search</button>
            </div>
        </>
    );
}

SearchRecipe.propTypes = {
    onSearchButtonClick: proptypes.func,
}

export default SearchRecipe;
