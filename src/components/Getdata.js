import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import { FaCalendarAlt, FaDownload } from 'react-icons/fa';  
function Getdata() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      
    const handleStartDateChange = (e) => {
       setStartDate(e.target.value);
    };
      
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `/api/data?startDate=${startDate}&endDate=${endDate}`, // Replace with your actual API endpoint
           {
             headers: {
                'Authorization':`Bearer ${localStorage.getItem('accessToken')}`
             }, 
           }
        );
         setData(response.data);
       } catch (err) {
           if (err.response) {
            setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
           } else if (err.request) {
            setError('Error: No response received from the server. Please check your network.');
           } else {
            setError(`Error: ${err.message}`);
           }
        } finally {
          setLoading(false);
        }
    };
      
    const handleDownload = () => {
      if (!data || data.length === 0) {
         alert('No data to download.');
         return;
      }
         
      // Convert data to Excel worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
         
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, 'data.xlsx');
     };
      
    return (
       <div className="container get-data-container mt-4">
         <h1 className="mb-4 text-center">Get Data</h1>
         <form onSubmit={handleSubmit} className="get-data-form">
            <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  <FaCalendarAlt className="input-icon" /> Start Date
                 </label>
                 <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={startDate}
                    onChange={handleStartDateChange}
                    required
                   />
                </div>
                <div className="form-group">
                   <label htmlFor="endDate" className="form-label">
                     <FaCalendarAlt className="input-icon" /> End Date
                    </label>
                   <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate}
                   onChange={handleEndDateChange}
                    required
                    />
                </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Loading...' : 'Get Data'}
              </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {data && data.length > 0 && (
            <div className="mt-4 text-center">
               <h2 className="mb-3">Professionals Data</h2>
                 <div className="table-responsive">
                   <table className="table table-bordered table-striped">
                     <thead>
                      <tr>
                         {/* Adjust header based on your API response fields */}
                         <th>Name</th>
                         <th>Email</th>
                         <th>Phone</th>
                          {/* add the more headr like city,country,date of birth,education*/}
                          <th>City</th>
                          <th>Country</th>
                          <th>Date of Birth</th>
                           <th>Education</th>
                      </tr>
                    </thead>
                   <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                         <td>{item.name}</td>
                           <td>{item.email}</td>
                            <td>{item.phone}</td>
                            {/* add the more data like city,country,date of birth,education*/}
                             <td>{item.city}</td>
                            <td>{item.country}</td>
                             <td>{item.dateOfBirth}</td>
                              <td>{item.education}</td>
                       </tr>
                     ))}
                </tbody>
              </table>
                </div>
                <button className="btn btn-success download-btn" onClick={handleDownload}>
                    <FaDownload className="download-icon" />
                    Download Data
                 </button>
            </div>
          )}
          { data && data.length === 0 &&
                (<div className="alert alert-info mt-3">No data found for selected date range.</div>)
               }
         </div>
    );
}
    
export default Getdata;