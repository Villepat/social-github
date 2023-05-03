import React from 'react'
import '../styles/ErrorPage.css'

const ErrorPage = ({errorType}) => {
    console.log('ErrorPage', errorType)
    return (
        <div className='error'>
        <h1>ErrorPage</h1>
        <h2 className='errorType'>{errorType}</h2>
        <h2 className='errorMessage'>Oops! Something went wrong.</h2>
        </div>

    )
}

export default ErrorPage