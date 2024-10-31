import {useEffect} from "react";

function About() {
    // scroll to the top each time we are at this page
    useEffect(()=>{
        window.scrollTo(0, 0);
    });

    return (
        <>
            <div className='about-div'>
                <h3 style={{textAlign: 'center', color: 'magenta'}}>About Us</h3>
                <p style={{fontSize: '1.125em'}}>
                    Welcome to <strong style={{
                        color: 'transparent', background: 'linear-gradient(to right, #a208fb, rgb(251, 53, 4))', backgroundClip: 'text'
                }}>SearchRecipe App</strong> – your ultimate recipe discovery hub!<br/>
                    Here, food lovers of all kinds can explore a world of flavors with just a few clicks.<br/>
                    Our platform is designed to make cooking easier and more enjoyable by helping you find<br/>
                    the perfect recipe for any occasion. Whether you&apos;re searching for a quick weekday dinner,<br/>
                    an indulgent dessert, or a healthy meal plan, we&apos;ve got you covered.<br/>

                    Save your favorite recipes for quick access, view detailed instructions and ingredients,<br/>
                    and manage your list as your tastes evolve. Dive into a community where finding, saving,<br/>
                    and cooking your next favorite meal is as easy as it is inspiring.
                </p>
            </div>
        </>
    );
}

export default About;
