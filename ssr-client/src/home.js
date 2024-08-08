// Home.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    console.log('Rendering Home component');
    return (
        <div>
            <Helmet>
                <title>Home Page</title>
                <meta name="description" content="This is the home page description." />
            </Helmet>
            <h2>Home Page</h2>
        </div>
    );
};

export default Home;
