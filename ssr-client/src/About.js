import React from 'react';
import { Helmet } from 'react-helmet-async';
 

const About = () => {

    React.useEffect(() => {
        console.log("UseEffect of About is working")
    }, [])
    return (
        <>
        <Helmet>
            <title>About Page</title>
            <meta name="description" content="This is the Abbb page description." />
        </Helmet>
        <div className="root">
            <h2>About Us</h2>
            <p>We are a company that specializes in...</p>
        </div>
        </>
    );
}

export default About;
