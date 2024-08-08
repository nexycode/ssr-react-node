import React from 'react';
import { Helmet } from 'react-helmet-async';

import "./main.css";

const Contact = () => {
    return (
       <>
        <Helmet>
                <title>Contact Page</title>
                <meta name="description" content="This is the Contact page description." />
            </Helmet>
        <div className="root">
            <h2>Contact Us</h2>
            <p>Reach out to us at contact@company.com</p>
        </div>
        </>
    );
}

export default Contact;
