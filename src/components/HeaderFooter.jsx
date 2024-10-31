// noinspection JSValidateTypes

import logo from '../assets/images/app-logo.png';
import {Link, Outlet} from "react-router-dom";
import {useRecipe} from "../contexts/RecipeContext.jsx";

function HeaderFooter() {
    const { setScrollPosition } = useRecipe();

    const saveHomeScrollPosition = ()=>{
        setScrollPosition(window.scrollY);
    }

    return (
        <>
            {/* header */}
            {/* logo and navs */}
                <div className='header-div'>
                    {/* logo and title */}
                    <Link to='/' style={{textDecoration: 'none', color: 'black'}}>
                        <div className='header-logo'>
                            <img src={logo} alt='app-logo' draggable='false'/>&nbsp;
                            <h3>SearchRecipe</h3>
                        </div>
                    </Link>

                    {/*  navigation links  */}
                    <div className='header-nav-div'>
                        <ul>
                            <li>
                            <Link to='/'>Home</Link>
                            </li>
                            <li>
                                <Link to='/about' onClick={saveHomeScrollPosition}>About</Link>
                            </li>
                            <li>
                                <Link to='/favorites' onClick={saveHomeScrollPosition}>Favorites</Link>
                            </li>
                        </ul>
                    </div>
                </div>

            <Outlet />

            {/* footer */}
            <footer>
                <div className='footer-div'>
                    <h3>&copy;SearchRecipe {new Date().getFullYear()}</h3>
                    <h3>&copy;Collins Masankwa</h3>
                </div>
            </footer>
        </>
    );
}

export default HeaderFooter;
