// Spinner.js
import React from 'react'
import loading from './loading.gif';
import './Spinner.css'; // Import the CSS file

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