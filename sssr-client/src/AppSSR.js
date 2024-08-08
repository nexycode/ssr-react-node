import App from "./App"
import PropTypes from 'prop-types' 
const AppSSR = ({ bootStrapCSS }) => {

    return (
        <html>
            <head>
                <meta charSet="utf-8"/>
                <title>SSR Client Title</title>
                {
                    bootStrapCSS.map(cssPath => <link key={cssPath} rel="stylesheet" href={cssPath}></link>)
                }
            </head>
            <body>
                <div id="root">
                    <App/>
                </div>
            </body>
        </html>
    )	
    
}

AppSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default AppSSR;
