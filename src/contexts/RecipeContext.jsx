import {createContext, useContext} from "react";

export let RecipeContext = createContext(null);

export const useRecipe = ()=> useContext(RecipeContext);
