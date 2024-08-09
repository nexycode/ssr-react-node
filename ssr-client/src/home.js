import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    console.log('Home component is rendering');  // Add this log to check if the component renders
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
