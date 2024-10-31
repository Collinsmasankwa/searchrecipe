import {BrowserRouter, Route, Routes} from "react-router-dom";
import HeaderFooter from "./HeaderFooter.jsx";
import Home from "./Home.jsx";
import RecipeDetails from "./RecipeDetails.jsx";
import RecipeProvider from "./RecipeProvider.jsx";
import Favorites from "./Favorites.jsx";
import About from "./About.jsx";
import SavedRecipeDetails from "./SavedRecipeDetails.jsx";

function Index(){
    return (
        <>
            <RecipeProvider>
                <BrowserRouter basename='/searchrecipe'>
                    <Routes>
                        <Route path='/' element={<HeaderFooter  />}>
                            <Route index element={<Home />} />
                            <Route path='/details/:id' element={<RecipeDetails />} />
                            <Route path='/favorites' element={<Favorites />} />
                            <Route path='/about' element={<About />} />
                            <Route path='/favorites/details/:id' element={<SavedRecipeDetails />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </RecipeProvider>
        </>
    );
}

export default Index;
