import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from "react-helmet";


const PageHelmet = ({ title }) => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description"  content="Web site created using create-react-app" />
                <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
                <title>{title}</title>
            </Helmet>
        </>
    )
}

PageHelmet.propTypes = {
    title: PropTypes.string
};

export default PageHelmet
