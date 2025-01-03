// Spinner.js
import React from 'react'
import loading from './loading.gif';

const Spinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner-wrapper">
                <img className='loading-gif' src={loading} alt="loading" />
                <p className="loading-text">Loading, please wait...</p>
            </div>
        </div>
    )
}

export default Spinner;