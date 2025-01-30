

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import {
//   FaCalendarAlt,
//   FaDownload,
//   FaChevronLeft,
//   FaChevronRight,
//   FaFilter,
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaArrowLeft,
// } from "react-icons/fa";
// import Spinner from "./Spinner";
// import { handleError } from "../utils";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faPills,
//   faClock,
//   faCalendarAlt,
//   faVenusMars,
//   faWeight,
//   faHeartPulse,
//   faLocationDot,
//     faCalendarDay,
//   faComment,
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// function Getdata() {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [allData, setAllData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [showDownload, setShowDownload] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);
//   const [isEditingDetail, setIsEditingDetail] = useState(false);
//   const [editFormData, setEditFormData] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const navigate = useNavigate();
//   const [showFilterSlide, setShowFilterSlide] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [records, setRecords] = useState([]);
//   const recordsPerPage = 10;

//   useEffect(() => {
//     setShowDownload(false);
//     checkLoginStatus();
//     fetchAllData();
//     fetchData(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
//   }, [currentPage]);

//   const checkLoginStatus = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!accessToken);
//   };

//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value);
//   };

//   const handleEndDateChange = (e) => {
//     setEndDate(e.target.value);
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
     
//       if (response.data.message === "Successfully getting Prescription Record!") {
//         setAllData(response.data.data);
//       }
//     } catch (err) {
//       if (err.response) {
//         setError(
//           `Error: ${err.response.status} - ${
//             err.response.data.message || err.response.statusText
//           }`
//         );
//       } else if (err.request) {
//         setError(
//           "Error: No response received from the server. Please check your network."
//         );
//       } else {
//         setError(`Error: ${err.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchData = async (page) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord&page=${page}&records_number=${recordsPerPage}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
    
//       if (response.data.message === "Successfully getting Prescription Record!") {
//         setRecords(response.data.data);
//         setTotalPages(Math.ceil(response.data.total_count / recordsPerPage)); // Calculate total pages
//       }
//     } catch (err) {
//       if (err.response) {
//         setError(
//           `Error: ${err.response.status} - ${
//             err.response.data.message || err.response.statusText
//           }`
//         );
//       } else if (err.request) {
//         setError(
//           "Error: No response received from the server. Please check your network."
//         );
//       } else {
//         setError(`Error: ${err.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage); // Update state only if the page changes
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    

//     if (startDate) {
//       const start = new Date(startDate); // Create the start date object
//       start.setHours(0, 0, 0, 0); // Set to midnight

//       let filtered = allData.filter((item) => {
//         const itemDate = new Date(item.prescription_date);
//         itemDate.setHours(0, 0, 0, 0); // Normalize date

//         if (endDate) {
//           const end = new Date(endDate);
//           end.setHours(0, 0, 0, 0);
//           return itemDate >= start && itemDate <= end; // Correct date comparison
//         }
//         return itemDate >= start;
//       });

//       setFilteredData(filtered);
//       if (filtered.length > 0) {
//         setShowDownload(true);
//       } else {
//         setShowDownload(false);
//       }
//     } else {
//       setFilteredData([]);
//       setShowDownload(false);
//     }
//   };

//   const getTimingText = (medication) => {
//     let timingText = "";
//     if (medication.timing.morning) timingText += "Morning ";
//     if (medication.timing.afternoon) timingText += "Afternoon ";
//     if (medication.timing.night) timingText += "Night ";
//     return timingText.trim();
//   };

//   const handleDownload = () => {
//     let downloadData = [...allData];

//     if (showFilterSlide) {
//       downloadData = [...filteredData];
//     }

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);

//       const end = new Date(endDate);
//       end.setHours(0, 0, 0, 0);
//       downloadData = downloadData.filter((item) => {
//         const itemDate = new Date(item.prescription_date);
//         itemDate.setHours(0, 0, 0, 0);

//         return itemDate >= start && itemDate <= end;
//       });
//     }

//     if (downloadData.length === 0) {
//       alert("No data to download.");
//       return;
//     }
//     const exportData = downloadData.map((item) => ({
//       "Patient Name": item.patient_name,
//       Date: item.prescription_date,
//       Medications: item.medications.map((med) => med.name).join(", "),
//       Timing: item.medications.map((med) => getTimingText(med)).join(", "),
//       "Age": item.age || 'N/A',
//       "Gender": item.gender || 'N/A',
//       "Weight": item.weight || 'N/A',
//       "Blood Pressure": item.bp || 'N/A',
//       "Complaint Section": item.complaints || 'N/A',
//       "Follow Up Date": item.follow_up_date || 'N/A',
//       "Address": item.place || 'N/A',
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Prescription Data");
//     XLSX.writeFile(workbook, "data.xlsx");
//   };

//   // Function to handle downloading all data with API call
//   const handleDownloadAll = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord&all_data=true`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const data = response.data.data;

//       if (data.length === 0) {
//         alert("No data to download.");
//         return;
//       }
      
//       const exportData = data.map((item) => ({
//         "Patient Name": item.patient_name,
//         Date: item.prescription_date,
//         Medications: item.medications.map((med) => med.name).join(", "),
//         Timing: item.medications.map((med) => getTimingText(med)).join(", "),
//          "Age": item.age || 'N/A',
//         "Gender": item.gender || 'N/A',
//         "Weight": item.weight || 'N/A',
//         "Blood Pressure": item.bp || 'N/A',
// "Complaint Section": item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : 'N/A',        "Follow Up Date": item.follow_up_date || 'N/A',
//         "Address": item.place || 'N/A',
//       }));
//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "All Prescription Data");
//       XLSX.writeFile(workbook, "all_data.xlsx");
//     } catch (err) {
//       if (err.response) {
//         setError(
//           `Error: ${err.response.status} - ${
//             err.response.data.message || err.response.statusText
//           }`
//         );
//       } else if (err.request) {
//         setError(
//           "Error: No response received from the server. Please check your network."
//         );
//       } else {
//         setError(`Error: ${err.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = (item) => {
//     setSelectedData(item);
//     setIsEditingDetail(false);
//     setEditFormData(null);
//   };
//   const handleEditDetail = () => {
//     setIsEditingDetail(true);
//     setEditFormData({ ...selectedData });
//   };
//   const handleCancelEditDetail = () => {
//     setIsEditingDetail(false);
//     setEditFormData(null);
//   };
//   const handleSaveDetail = async (updatedData) => {
//     try {
//       await sendEditedDataToBackend(updatedData);

//       setRecords((prevRecords) =>
//         prevRecords.map((item) =>
//           item.id === updatedData.id ? updatedData : item
//         )
//       );

//       setAllData((prevAllData) =>
//         prevAllData.map((item) =>
//           item.id === updatedData.id ? updatedData : item
//         )
//       );
//       setFilteredData((prevFilteredData) =>
//         prevFilteredData.map((item) =>
//           item.id === updatedData.id ? updatedData : item
//         )
//       );

//       setSelectedData(null);
//       setIsEditingDetail(false);
//       setSuccessMessage("Data updated successfully!");
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate("/getdata");
//       }, 2000);
//     } catch (error) {
//       console.error("Error sending updated data to backend:", error);
//       handleError(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     }
//   };

//   const sendEditedDataToBackend = async (data) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.patch(
//         "https://bharati-clinic-test.vercel.app/prescription/",
//         {
//           action: "patchPrescriptionRecord",
//           ...data,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       setSuccessMessage("Data upload successfully!");
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate("/getdata");
//       }, 2000);
//       return response;
//     } catch (error) {
//       console.error("Error sending updated data to backend:", error);
//       throw error;
//     }
//   };

//   const handleDeleteData = async (id) => {
//     console.log("In delete");
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       console.log(accessToken);

//       await axios.delete(
//         `https://bharati-clinic-test.vercel.app/prescription/`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           data: {
//             action: "delPrescriptionRecord",
//             id: id,
//           },
//         }
//       );

//       setRecords((prevRecords) => prevRecords.filter((item) => item.id !== id)); // Update records state
//       setAllData((prevAllData) => prevAllData.filter((item) => item.id !== id));

//       setFilteredData((prevFilteredData) =>
//         prevFilteredData.filter((item) => item.id !== id)
//       );

//       setSelectedData(null);
//       setSuccessMessage("Data deleted successfully!");
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate("/getdata");
//       }, 2000);
//     } catch (error) {
//       console.error("Error deleting the data:", error);
//       handleError(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     }
//   };

//    const handleInputChange = (e, key) => {
//         const { value } = e.target;
//         setEditFormData((prevData) => {
//            if (key === "B/P") {
//                 return { ...prevData, "B/P": value };
//             } else {
//                 return { ...prevData, [key]: value };
//             }
//         });
//     };


//   const handleTimingChange = (e, medicationIndex, timingKey) => {
//     const isChecked = e.target.checked;
//     setEditFormData((prevData) => {
//       if (
//         !prevData ||
//         !prevData.medications ||
//         !prevData.medications[medicationIndex]
//       ) {
//         return prevData;
//       }
//       const newMedications = prevData.medications.map((med, index) => {
//         if (index === medicationIndex) {
//           return { ...med, timing: { ...med.timing, [timingKey]: isChecked } };
//         }
//         return med;
//       });
//       return { ...prevData, medications: newMedications };
//     });
//   };

//   const handleMedicationNameChange = (e, medicationIndex) => {
//     const { value } = e.target;
//     setEditFormData((prevData) => {
//       if (!prevData || !prevData.medications) {
//         return prevData;
//       }
//       const newMedications = prevData.medications.map((med, index) => {
//         if (index === medicationIndex) {
//           return { ...med, name: value };
//         }
//         return med;
//       });
//       return { ...prevData, medications: newMedications };
//     });
//   };

//   const handleBack = () => {
//     setSelectedData(null);
//     setEditFormData(null);
//   };

//   const handleHideDateForm = () => {
//      setShowFilterSlide(false);
//     setStartDate("");
//     setEndDate("");
//   };

//   const handleBackToHome = () => {
//     navigate("/");
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="container mt-4 text-center">
//         <h1>Please Login</h1>
//       </div>
//     );
//   }
//   return (
//     <div className="container get-data-container mt-4">
//       {showSuccess && (
//         <div
//           className={`success-message-container ${showSuccess ? "show" : ""}`}
//         >
//           {successMessage}
//         </div>
//       )}

//       <h1 className="mb-4 text-center">Patient Details</h1>
//       {/* slide one */}
//       {!showFilterSlide && (
//         <div className="mt-4 text-center">
//           <div className="filter-download-container">
//             <button
//               className="show-date-form-button"
//               onClick={() => setShowFilterSlide(true)}
//             >
//               <FaFilter />
//             </button>
//             <button
//               className="download-all-button"
//               onClick={handleDownloadAll}
//               disabled={loading} // Disable while loading
//             >
//               <FaDownload />
//               {loading ? "Downloading..." : "Download All"}
//             </button>
//           </div>

//           <div className="table-header">
//             <h2 className="mb-3" style={{ fontWeight: 400 }}>
//               Prescription Data
//             </h2>
//             <div className="back-to-home-button-container">
//               <button
//                 className="back-to-home-button"
//                 onClick={handleBackToHome}
//               >
//                 <FaArrowLeft />
//               </button>
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead>
//                 <tr>
//                     <th>Serial No.</th>
//                     <th>Patient Name</th>
//                     <th>Date</th>
//                     <th>Medications</th>
//                     <th>Timing</th>
//                     <th>Age</th>
//                     <th>Gender</th>
//                     <th>Weight</th>
//                     <th>Blood Pressure</th>
//                      <th>Complaint Section</th>
//                     <th>Follow Up Date</th>
//                     <th>Address</th>
//                     <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {records.map((item, index) => (
//                   <tr key={index}>
//                     <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
//                     <td>{item.patient_name}</td>
//                     <td>
//                       {item.prescription_date
//                         ? new Date(item.prescription_date).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                     <td>
//                       {item.medications.map((med) => med.name).join(", ")}
//                     </td>
//                     <td>
//                       {item.medications
//                         .map((med) => getTimingText(med))
//                         .join(", ")}
//                     </td>
//                     <td>{item.age || "N/A"}</td>
//                     <td>{item.gender || "N/A"}</td>
//                     <td>{item.weight || "N/A"}</td>
//                     <td>{item.bp || "N/A"}</td>
//                     <td>{item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : "N/A"}</td>
//                     <td>{item.follow_up_date || "N/A"}</td>
//                     <td>{item.place || "N/A"}</td>
//                     <td>
//                       <button
//                         className="view-data-button"
//                         onClick={() => handleView(item)}
//                       >
//                         <FaEye />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pagination-container">
//             <div className="pagination">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="pagination-button"
//               >
//                 <FaChevronLeft />
//               </button>
//               <span className="page-number">
//                 {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="pagination-button"
//               >
//                 <FaChevronRight />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* slide two */}
//       {showFilterSlide && (
//         <div className="mt-4 text-center">
//           <div className="date-form-container-bottom">
//             <form onSubmit={handleSubmit} className="get-data-form">
//               <div className="date-back-button-container">
//                 <button
//                   type="button"
//                   className="date-back-button back-button"
//                   onClick={handleHideDateForm}
//                 >
//                   <FaArrowLeft />
//                 </button>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="startDate" className="form-label">
//                   <FaCalendarAlt className="input-icon" /> Start Date
//                 </label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   className="form-control"
//                   value={startDate}
//                   onChange={handleStartDateChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="endDate" className="form-label">
//                   <FaCalendarAlt className="input-icon" /> End Date
//                 </label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   className="form-control"
//                   value={endDate}
//                   onChange={handleEndDateChange}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={loading}
//               >
//                 {loading ? "Get Data" : "Get Data"}
//               </button>
//             </form>
//           </div>
//           <div className="table-header">
//             <div className="back-to-home-button-container"></div>
//           </div>

//           {filteredData.length > 0 && (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                <thead>
//                     <tr>
//                         <th>Serial No.</th>
//                         <th>Patient Name</th>
//                         <th>Date</th>
//                         <th>Medications</th>
//                         <th>Timing</th>
//                          <th>Age</th>
//                         <th>Gender</th>
//                         <th>Weight</th>
//                         <th>Blood Pressure</th>
//                         <th>Complaint Section</th>
//                         <th>Follow Up Date</th>
//                         <th>Address</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                    {filteredData.map((item, index) => (
//                     <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{item.patient_name}</td>
//                         <td>
//                             {item.prescription_date
//                                 ? new Date(
//                                     item.prescription_date
//                                   ).toLocaleDateString()
//                                 : "N/A"}
//                         </td>
//                         <td>
//                             {item.medications.map((med) => med.name).join(", ")}
//                         </td>
//                         <td>
//                             {item.medications
//                                 .map((med) => getTimingText(med))
//                                 .join(", ")}
//                         </td>
//                         <td>{item.age || "N/A"}</td>
//                       <td>{item.gender || "N/A"}</td>
//                       <td>{item.weight || "N/A"}</td>
//                       <td>{item.bp || "N/A"}</td>
//                       <td>{item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : "N/A"}</td>                      <td>{item.follow_up_date || "N/A"}</td>
//                       <td>{item.place || "N/A"}</td>
//                       <td>
//                             <button
//                                 className="view-data-button"
//                                 onClick={() => handleView(item)}
//                             >
//                                 <FaEye />
//                             </button>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {filteredData.length === 0 && (
//             <div className="alert alert-info mt-3">
//               No data found for selected date range.
//             </div>
//           )}
//           {showDownload && (
//             <button
//               className="btn btn-success download-btn"
//               onClick={handleDownload}
//             >
//               <FaDownload className="download-icon" />
//               Download Data
//             </button>
//           )}
//         </div>
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//       {loading && <Spinner />}
//       {selectedData && (
//         <div className="detail-container" style={{ zIndex: 10000 }}>
//           <div className="detail-content">
//             <div className="detail-header">
//               <button className="back-button" onClick={handleBack}>
//                 <FaArrowLeft />
//               </button>

//               <div className="header-container">
//                 <h2 className="middle-text">Prescription Details</h2>
//               </div>
//             </div>
//             {isEditingDetail ? (
//               <div className="home-edit-form">
//                 <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon icon={faUser} className="home-icon" />
//                     Patient Name:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     style={{ zIndex: 10000 }}
//                     value={editFormData?.patient_name || ""}
//                     onChange={(e) => handleInputChange(e, "patient_name")}
//                   />
//                 </div>
//                 <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon
//                       icon={faCalendarAlt}
//                       className="home-icon"
//                     />
//                     Date:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     style={{ zIndex: 10000 }}
//                     value={editFormData?.prescription_date || ""}
//                     onChange={(e) => handleInputChange(e, "prescription_date")}
//                   />
//                 </div>
//                   <div className="home-form-group">
//                       <label className="home-form-label">
//                       <FontAwesomeIcon icon={faUser} className="home-icon" />
//                         Age:
//                       </label>
//                     <input
//                       type="text"
//                       className="home-form-input"
//                       style={{ zIndex: 10000 }}
//                         value={editFormData?.age || ""}
//                         onChange={(e) => handleInputChange(e, "age")}
//                       />
//                     </div>
//                    <div className="home-form-group">
//                         <label className="home-form-label">
//                            <FontAwesomeIcon icon={faVenusMars} className="home-icon" />
//                         Gender:
//                         </label>
//                       <input
//                         type="text"
//                         className="home-form-input"
//                         style={{ zIndex: 10000 }}
//                         value={editFormData?.gender || ""}
//                         onChange={(e) => handleInputChange(e, "gender")}
//                       />
//                     </div>
//                    <div className="home-form-group">
//                       <label className="home-form-label">
//                          <FontAwesomeIcon icon={faWeight} className="home-icon" />
//                       Weight:
//                       </label>
//                      <input
//                         type="text"
//                        className="home-form-input"
//                         style={{ zIndex: 10000 }}
//                        value={editFormData?.weight || ""}
//                         onChange={(e) => handleInputChange(e, "weight")}
//                        />
//                     </div>
//                    <div className="home-form-group">
//                        <label className="home-form-label">
//                            <FontAwesomeIcon icon={faHeartPulse} className="home-icon" />
//                         Blood Pressure:
//                         </label>
//                       <input
//                         type="text"
//                          className="home-form-input"
//                         style={{ zIndex: 10000 }}
//                         value={editFormData?.bp || ""}
//                          onChange={(e) => handleInputChange(e, "bp")}
//                         />
//                   </div>
//                   <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon icon={faComment} className="home-icon" />
//                     Complaint Section:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     style={{ zIndex: 10000 }}
//                     value={editFormData?.complaints || ""}
//                     onChange={(e) => handleInputChange(e, "complaints")}
//                   />
//                 </div>
//                    <div className="home-form-group">
//                        <label className="home-form-label">
//                            <FontAwesomeIcon icon={faCalendarDay} className="home-icon" />
//                       Follow Up Date:
//                       </label>
//                      <input
//                        type="text"
//                        className="home-form-input"
//                        style={{ zIndex: 10000 }}
//                        value={editFormData?.follow_up_date || ""}
//                        onChange={(e) => handleInputChange(e, "follow_up_date")}
//                      />
//                   </div>
//                   <div className="home-form-group">
//                        <label className="home-form-label">
//                            <FontAwesomeIcon icon={faLocationDot} className="home-icon" />
//                       Address:
//                      </label>
//                      <input
//                       type="text"
//                         className="home-form-input"
//                       style={{ zIndex: 10000 }}
//                       value={editFormData?.place || ""}
//                       onChange={(e) => handleInputChange(e, "place")}
//                      />
//                  </div>
//                 <h3 className="home-medication-title">
//                   <FontAwesomeIcon icon={faPills} className="home-icon" />
//                   Medications:
//                 </h3>
//                 <ul className="home-medication-list">
//                   {editFormData?.medications &&
//                     editFormData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <div className="home-medication-name">
//                           <label className="home-form-label">
//                             Name:
//                             <input
//                               type="text"
//                               className="home-form-input"
//                               value={medication.name}
//                               onChange={(e) =>
//                                 handleMedicationNameChange(e, index)
//                               }
//                             />
//                           </label>
//                         </div>
//                         <div className="home-medication-timing">
//                           <label className="home-form-label">
//                             <FontAwesomeIcon
//                               icon={faClock}
//                               className="home-icon"
//                             />
//                             Timing:
//                             {Object.entries(medication.timing).map(
//                               ([key, value]) => (
//                                 <label key={key} className="home-timing-label">
//                                   <input
//                                     type="checkbox"
//                                     className="home-timing-checkbox"
//                                     checked={value}
//                                     onChange={(e) =>
//                                       handleTimingChange(e, index, key)
//                                     }
//                                   />
//                                   {key.charAt(0).toUpperCase() + key.slice(1)}
//                                 </label>
//                               )
//                             )}
//                           </label>
//                         </div>
//                       </li>
//                     ))}
//                 </ul>

//                 <div className="home-save-cancel-container">
//                   <button
//                     className="home-save-button"
//                     onClick={() => handleSaveDetail(editFormData)}
//                   >
//                     submit
//                   </button>
//                   <button
//                     className="home-cancel-button"
//                     onClick={handleCancelEditDetail}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div>
//               <p className="prescription">
//                 <strong>Patient Name:</strong> {selectedData.patient_name}
//               </p>
//               <p className="prescription">
//                 <strong>Date:</strong> {selectedData.prescription_date}
//               </p>
//               <p className="prescription">
//                 <strong>Age:</strong> {selectedData.age || 'N/A'}
//               </p>
//               <p className="prescription">
//                 <strong>Gender:</strong> {selectedData.gender || 'N/A'}
//               </p>
//               <p className="prescription">
//                 <strong>Weight:</strong> {selectedData.weight || 'N/A'}
//               </p>
//               <p className="prescription">
//                 <strong>Blood Pressure:</strong> {selectedData.bp || 'N/A'}
//               </p>
//               <p className="prescription">
//                   <strong>Complaint Section:</strong>
//                   {selectedData.complaints ? (Array.isArray(selectedData.complaints) ? selectedData.complaints.join(", ") : selectedData.complaints) : "N/A"}
//                 </p>
//               <p className="prescription">
//                 <strong>Follow Up Date:</strong> {selectedData.follow_up_date || 'N/A'}
//               </p>
//               <p className="prescription">
//                 <strong>Address:</strong> {selectedData.place || 'N/A'}
//               </p>
//                 <h3 className="home-medication-title">Medications:</h3>
//                 <ul className="home-medication-list">
//                   {selectedData.medications &&
//                     selectedData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <p>
//                           <strong>Name:</strong> {medication.name}
//                         </p>
//                         <p>
//                           <strong>Timing:</strong>{" "}
//                           {Object.entries(medication.timing)
//                             .filter(([_, value]) => value)
//                             .map(
//                               ([key]) =>
//                                 key.charAt(0).toUpperCase() + key.slice(1)
//                             )
//                             .join(", ")}
//                         </p>
//                       </li>
//                     ))}
//                 </ul>
//                 <div className="home-edit-button-container">
//                   <button
//                     className="home-edit-button"
//                     onClick={handleEditDetail}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     className="home-remove-image-button"
//                     onClick={() => handleDeleteData(selectedData.id)}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Getdata;



import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  FaCalendarAlt,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import Spinner from "./Spinner";
import { handleError } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPills,
  faClock,
  faCalendarAlt,
  faVenusMars,
  faWeight,
  faHeartPulse,
  faLocationDot,
    faCalendarDay,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Getdata() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDownload, setShowDownload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [showFilterSlide, setShowFilterSlide] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [records, setRecords] = useState([]);
  const recordsPerPage = 10;

  useEffect(() => {
    setShowDownload(false);
    checkLoginStatus();
    fetchAllData();
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  }, [currentPage]);

  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
     
      if (response.data.message === "Successfully getting Prescription Record!") {
        const formattedData = response.data.data.map(item => ({
          ...item,
           gender: item.gender || 'N/A',
            weight: item.weight || 'N/A',
            place: item.place || 'N/A',
            bp: item.bp || 'N/A',
            follow_up_date: item.follow_up_date || '',
            Date: item.prescription_date || 'N/A',

         }));
        setAllData(response.data.data);
      }
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError(
          "Error: No response received from the server. Please check your network."
        );
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord&page=${page}&records_number=${recordsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      if (response.data.message === "Successfully getting Prescription Record!") {
        setRecords(response.data.data);
        const formattedData = response.data.data.map(item => ({
          ...item,
            gender: item.gender || 'N/A',
            weight: item.weight || 'N/A',
            place: item.place || 'N/A',
            bp: item.bp || 'N/A',
            follow_up_date: item.follow_up_date || '',
            Date: item.prescription_date || 'N/A',

         }));
        setTotalPages(Math.ceil(response.data.total_count / recordsPerPage)); // Calculate total pages
      }
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError(
          "Error: No response received from the server. Please check your network."
        );
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Update state only if the page changes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (startDate) {
      const start = new Date(startDate); // Create the start date object
      start.setHours(0, 0, 0, 0); // Set to midnight

      let filtered = allData.filter((item) => {
        const itemDate = new Date(item.prescription_date);
        itemDate.setHours(0, 0, 0, 0); // Normalize date

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          return itemDate >= start && itemDate <= end; // Correct date comparison
        }
        return itemDate >= start;
      });

      setFilteredData(filtered);
      if (filtered.length > 0) {
        setShowDownload(true);
      } else {
        setShowDownload(false);
      }
    } else {
      setFilteredData([]);
      setShowDownload(false);
    }
  };

  const getTimingText = (medication) => {
    let timingText = "";
    if (medication.timing.morning) timingText += "Morning ";
    if (medication.timing.afternoon) timingText += "Afternoon ";
    if (medication.timing.night) timingText += "Night ";
    return timingText.trim();
  };

  const handleDownload = () => {
    let downloadData = [...allData];

    if (showFilterSlide) {
      downloadData = [...filteredData];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      downloadData = downloadData.filter((item) => {
        const itemDate = new Date(item.prescription_date);
        itemDate.setHours(0, 0, 0, 0);

        return itemDate >= start && itemDate <= end;
      });
    }

    if (downloadData.length === 0) {
      alert("No data to download.");
      return;
    }
    const exportData = downloadData.map((item) => ({
      "Patient Name": item.patient_name,
      "prescription-Date": item.prescription_date,
      Medications: item.medications.map((med) => med.name).join(", "),
      Timing: item.medications.map((med) => getTimingText(med)).join(", "),
      "Age": item.age || 'N/A',
      "Gender": item.gender || 'N/A',
      "Weight": item.weight || 'N/A',
      "Blood Pressure": item.bp || 'N/A',
      "Complaint Section": item.complaints || 'N/A',
      "Follow Up Date": item.follow_up_date || '',
      "Address": item.place || 'N/A',
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prescription Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  // Function to handle downloading all data with API call
  const handleDownloadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://bharati-clinic-test.vercel.app/prescription/?action=getPrescriptionRecord&all_data=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;

      if (data.length === 0) {
        alert("No data to download.");
        return;
      }
      
      const exportData = data.map((item) => ({
        "Patient Name": item.patient_name,
        "prescription-Date": item.prescription_date,
        Medications: item.medications.map((med) => med.name).join(", "),
        Timing: item.medications.map((med) => getTimingText(med)).join(", "),
         "Age": item.age || 'N/A',
        "Gender": item.gender || 'N/A',
        "Weight": item.weight || 'N/A',
        "Blood Pressure": item.bp || 'N/A',
        "Complaint Section": item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : 'N/A',   
        "Follow Up Date": item.follow_up_date || '',
        "Address": item.place || 'N/A',
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Prescription Data");
      XLSX.writeFile(workbook, "all_data.xlsx");
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError(
          "Error: No response received from the server. Please check your network."
        );
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    setSelectedData(item);
    setIsEditingDetail(false);
    setEditFormData(null);
  };
  const handleEditDetail = () => {
    setIsEditingDetail(true);
    setEditFormData({ ...selectedData });
  };
  const handleCancelEditDetail = () => {
    setIsEditingDetail(false);
    setEditFormData(null);
  };
    const handleSaveDetail = async (updatedData) => {
    try {
        const formattedData = {
            ...updatedData,
            gender: updatedData.gender, // lowercase here
            weight: updatedData.weight,
            place: updatedData.place,
            bp: updatedData.bp,
            follow_up_date: updatedData.follow_up_date,
            Date: updatedData.prescription_date

        };

        await sendEditedDataToBackend(formattedData);


        setRecords((prevRecords) =>
            prevRecords.map((item) =>
                item.id === updatedData.id ? {...item,  ...formattedData} : item
            )
        );


        setAllData((prevAllData) =>
            prevAllData.map((item) =>
                item.id === updatedData.id ? {...item,  ...formattedData}  : item
            )
        );


        setFilteredData((prevFilteredData) =>
            prevFilteredData.map((item) =>
                item.id === updatedData.id ? {...item, ...formattedData} : item
            )
        );

        setSelectedData(null);
        setIsEditingDetail(false);
        setSuccessMessage("Data updated successfully!");
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigate("/getdata");
        }, 2000);
    } catch (error) {
        console.error("Error sending updated data to backend:", error);
        handleError(
            error.response?.data?.message || "An unexpected error occurred."
        );
    }
};
  const sendEditedDataToBackend = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.patch(
        "https://bharati-clinic-test.vercel.app/prescription/",
        {
          action: "patchPrescriptionRecord",
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccessMessage("Data upload successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/getdata");
      }, 2000);
      return response;
    } catch (error) {
      console.error("Error sending updated data to backend:", error);
      throw error;
    }
  };

  const handleDeleteData = async (id) => {
    console.log("In delete");
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);

      await axios.delete(
        `https://bharati-clinic-test.vercel.app/prescription/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            action: "delPrescriptionRecord",
            id: id,
          },
        }
      );

      setRecords((prevRecords) => prevRecords.filter((item) => item.id !== id)); // Update records state
      setAllData((prevAllData) => prevAllData.filter((item) => item.id !== id));

      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((item) => item.id !== id)
      );

      setSelectedData(null);
      setSuccessMessage("Data deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/getdata");
      }, 2000);
    } catch (error) {
      console.error("Error deleting the data:", error);
      handleError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

   const handleInputChange = (e, key) => {
        const { value } = e.target;
        setEditFormData((prevData) => {
           if (key === "B/P") {
                return { ...prevData, "B/P": value };
            } else {
                return { ...prevData, [key]: value };
            }
        });
    };


  const handleTimingChange = (e, medicationIndex, timingKey) => {
    const isChecked = e.target.checked;
    
    setEditFormData((prevData) => {
      if (
        !prevData ||
        !prevData.medications ||
        !prevData.medications[medicationIndex]
      ) {
        return prevData;
      }
      const newMedications = prevData.medications.map((med, index) => {
        if (index === medicationIndex) {
          return { ...med, timing: { ...med.timing, [timingKey]: isChecked } };
        }
        return med;
      });
      return { ...prevData, medications: newMedications };
    });
  };

  const handleMedicationNameChange = (e, medicationIndex) => {
    const { value } = e.target;
    setEditFormData((prevData) => {
      if (!prevData || !prevData.medications) {
        return prevData;
      }
      const newMedications = prevData.medications.map((med, index) => {
        if (index === medicationIndex) {
          return { ...med, name: value };
        }
        return med;
      });
      return { ...prevData, medications: newMedications };
    });
  };

  const handleBack = () => {
    setSelectedData(null);
    setEditFormData(null);
  };

  const handleHideDateForm = () => {
     setShowFilterSlide(false);
    setStartDate("");
    setEndDate("");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-4 text-center">
        <h1>Please Login</h1>
      </div>
    );
  }
  return (
    <div className="container get-data-container mt-4">
      {showSuccess && (
        <div
          className={`success-message-container ${showSuccess ? "show" : ""}`}
        >
          {successMessage}
        </div>
      )}

      <h1 className="mb-4 text-center">Patient Details</h1>
      {/* slide one */}
      {!showFilterSlide && (
        <div className="mt-4 text-center">
          <div className="filter-download-container">
            <button
              className="show-date-form-button"
              onClick={() => setShowFilterSlide(true)}
            >
              <FaFilter />
            </button>
            <button
              className="download-all-button"
              onClick={handleDownloadAll}
              disabled={loading} // Disable while loading
            >
              <FaDownload />
              {loading ? "Downloading..." : "Download All"}
            </button>
          </div>

          <div className="table-header">
            <h2 className="mb-3" style={{ fontWeight: 400 }}>
              Prescription Data
            </h2>
            <div className="back-to-home-button-container">
              <button
                className="back-to-home-button"
                onClick={handleBackToHome}
              >
                <FaArrowLeft />
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                    <th>Serial No.</th>
                    <th>Patient Name</th>
                    <th>prescription Date</th>
                    <th>Medications</th>
                    <th>Timing</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Weight</th>
                    <th>Blood Pressure</th>
                     <th>Complaint Section</th>
                    <th>Follow Up Date</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                    <td>{item.patient_name}</td>
                    <td>
                      {item.prescription_date
                        ? new Date(item.prescription_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {item.medications.map((med) => med.name).join(", ")}
                    </td>
                    <td>
                      {item.medications
                        .map((med) => getTimingText(med))
                        .join(", ")}
                    </td>
                    <td>{item.age || "N/A"}</td>
                    <td>{item.gender || "N/A"}</td>
                    <td>{item.weight || "N/A"}</td>
                    <td>{item.bp || "N/A"}</td>
                    <td>{item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : "N/A"}</td>
                    <td>{item.follow_up_date || ""}</td>
                    <td>{item.place || "N/A"}</td>
                    <td>
                      <button
                        className="view-data-button"
                        onClick={() => handleView(item)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <FaChevronLeft />
              </button>
              <span className="page-number">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* slide two */}
      {showFilterSlide && (
        <div className="mt-4 text-center">
          <div className="date-form-container-bottom">
            <form onSubmit={handleSubmit} className="get-data-form">
              <div className="date-back-button-container">
                <button
                  type="button"
                  className="date-back-button back-button"
                  onClick={handleHideDateForm}
                >
                  <FaArrowLeft />
                </button>
              </div>
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Get Data" : "Get Data"}
              </button>
            </form>
          </div>
          <div className="table-header">
            <div className="back-to-home-button-container"></div>
          </div>

          {filteredData.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
               <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Patient Name</th>
                        <th>prescription Date</th>
                        <th>Medications</th>
                        <th>Timing</th>
                         <th>Age</th>
                        <th>Gender</th>
                        <th>Weight</th>
                        <th>Blood Pressure</th>
                        <th>Complaint Section</th>
                        <th>Follow Up Date</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                   {filteredData.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.patient_name}</td>
                        <td>
                            {item.prescription_date
                                ? new Date(
                                    item.prescription_date
                                  ).toLocaleDateString()
                                : "N/A"}
                        </td>
                        <td>
                            {item.medications.map((med) => med.name).join(", ")}
                        </td>
                        <td>
                            {item.medications
                                .map((med) => getTimingText(med))
                                .join(", ")}
                        </td>
                        <td>{item.age || "N/A"}</td>
                      <td>{item.gender || "N/A"}</td>
                      <td>{item.weight || "N/A"}</td>
                      <td>{item.bp || "N/A"}</td>
                      <td>{item.complaints ? (Array.isArray(item.complaints) ? item.complaints.join(", ") : item.complaints) : "N/A"}</td>                      <td>{item.follow_up_date || "N/A"}</td>
                      <td>{item.place || "N/A"}</td>
                      <td>
                            <button
                                className="view-data-button"
                                onClick={() => handleView(item)}
                            >
                                <FaEye />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredData.length === 0 && (
            <div className="alert alert-info mt-3">
              No data found for selected date range.
            </div>
          )}
          {showDownload && (
            <button
              className="btn btn-success download-btn"
              onClick={handleDownload}
            >
              <FaDownload className="download-icon" />
              Download Data
            </button>
          )}
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {loading && <Spinner />}
      {selectedData && (
        <div className="detail-container" style={{ zIndex: 10000 }}>
          <div className="detail-content">
            <div className="detail-header">
              <button className="back-button" onClick={handleBack}>
                <FaArrowLeft />
              </button>

              <div className="header-container">
                <h2 className="middle-text">Prescription Details</h2>
              </div>
            </div>
            {isEditingDetail ? (
              <div className="home-edit-form">
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faUser} className="home-icon" />
                    Patient Name:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    style={{ zIndex: 10000 }}
                    value={editFormData?.patient_name || ""}
                    onChange={(e) => handleInputChange(e, "patient_name")}
                  />
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="home-icon"
                    />
                    Prescription Date:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    style={{ zIndex: 10000 }}
                    value={editFormData?.prescription_date || ""}
                    onChange={(e) => handleInputChange(e, "prescription_date")}
                  />
                </div>
                  <div className="home-form-group">
                      <label className="home-form-label">
                      <FontAwesomeIcon icon={faUser} className="home-icon" />
                        Age:
                      </label>
                    <input
                      type="text"
                      className="home-form-input"
                      style={{ zIndex: 10000 }}
                        value={editFormData?.age || ""}
                        onChange={(e) => handleInputChange(e, "age")}
                      />
                    </div>
                   <div className="home-form-group">
                        <label className="home-form-label">
                           <FontAwesomeIcon icon={faVenusMars} className="home-icon" />
                        Gender:
                        </label>
                      <input
                        type="text"
                        className="home-form-input"
                        style={{ zIndex: 10000 }}
                        value={editFormData?.gender || ""}
                        onChange={(e) => handleInputChange(e, "gender")}
                      />
                    </div>
                   <div className="home-form-group">
                      <label className="home-form-label">
                         <FontAwesomeIcon icon={faWeight} className="home-icon" />
                      Weight:
                      </label>
                     <input
                        type="text"
                       className="home-form-input"
                        style={{ zIndex: 10000 }}
                       value={editFormData?.weight || ""}
                        onChange={(e) => handleInputChange(e, "weight")}
                       />
                    </div>
                   <div className="home-form-group">
                       <label className="home-form-label">
                           <FontAwesomeIcon icon={faHeartPulse} className="home-icon" />
                        Blood Pressure:
                        </label>
                      <input
                        type="text"
                         className="home-form-input"
                        style={{ zIndex: 10000 }}
                        value={editFormData?.bp || ""}
                         onChange={(e) => handleInputChange(e, "bp")}
                        />
                  </div>
                  <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faComment} className="home-icon" />
                    Complaint Section:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    style={{ zIndex: 10000 }}
                    value={editFormData?.complaints || ""}
                    onChange={(e) => handleInputChange(e, "complaints")}
                  />
                </div>
                   <div className="home-form-group">
                       <label className="home-form-label">
                           <FontAwesomeIcon icon={faCalendarDay} className="home-icon" />
                      Follow Up Date:
                      </label>
                     <input
                       type="text"
                       className="home-form-input"
                       style={{ zIndex: 10000 }}
                       value={editFormData?.follow_up_date || ""}
                       onChange={(e) => handleInputChange(e, "follow_up_date")}
                     />
                  </div>
                  <div className="home-form-group">
                       <label className="home-form-label">
                           <FontAwesomeIcon icon={faLocationDot} className="home-icon" />
                      Address:
                     </label>
                     <input
                      type="text"
                        className="home-form-input"
                      style={{ zIndex: 10000 }}
                      value={editFormData?.place || ""}
                      onChange={(e) => handleInputChange(e, "place")}
                     />
                 </div>
                <h3 className="home-medication-title">
                  <FontAwesomeIcon icon={faPills} className="home-icon" />
                  Medications:
                </h3>
                <ul className="home-medication-list">
                  {editFormData?.medications &&
                    editFormData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <div className="home-medication-name">
                          <label className="home-form-label">
                            Name:
                            <input
                              type="text"
                              className="home-form-input"
                              value={medication.name}
                              onChange={(e) =>
                                handleMedicationNameChange(e, index)
                              }
                            />
                          </label>
                        </div>
                        <div className="home-medication-timing">
                          <label className="home-form-label">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="home-icon"
                            />
                            Timing:
                            {Object.entries(medication.timing).map(
                              ([key, value]) => (
                                <label key={key} className="home-timing-label">
                                  <input
                                    type="checkbox"
                                    className="home-timing-checkbox"
                                    checked={value}
                                    onChange={(e) =>
                                      handleTimingChange(e, index, key)
                                    }
                                  />
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                              )
                            )}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>

                <div className="home-save-cancel-container">
                  <button
                    className="home-save-button"
                    onClick={() => handleSaveDetail(editFormData)}
                  >
                    submit
                  </button>
                  <button
                    className="home-cancel-button"
                    onClick={handleCancelEditDetail}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
              <p className="prescription">
                <strong>Patient Name:</strong> {selectedData.patient_name}
              </p>
              <p className="prescription">
                <strong>prescription Date:</strong> {selectedData.prescription_date}
              </p>
              <p className="prescription">
                <strong>Age:</strong> {selectedData.age || 'N/A'}
              </p>
              <p className="prescription">
                <strong>Gender:</strong> {selectedData.gender || 'N/A'}
              </p>
              <p className="prescription">
                <strong>Weight:</strong> {selectedData.weight || 'N/A'}
              </p>
              <p className="prescription">
                <strong>Blood Pressure:</strong> {selectedData.bp || 'N/A'}
              </p>
              <p className="prescription">
                  <strong>Complaint Section:</strong>
                  {selectedData.complaints ? (Array.isArray(selectedData.complaints) ? selectedData.complaints.join(", ") : selectedData.complaints) : "N/A"}
                </p>
              <p className="prescription">
                <strong>Follow Up Date:</strong> {selectedData.follow_up_date || ''}
              </p>
              <p className="prescription">
                <strong>Address:</strong> {selectedData.place || 'N/A'}
              </p>
                <h3 className="home-medication-title">Medications:</h3>
                <ul className="home-medication-list">
                  {selectedData.medications &&
                    selectedData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <p>
                          <strong>Name:</strong> {medication.name}
                        </p>
                        <p>
                          <strong>Timing:</strong>{" "}
                          {Object.entries(medication.timing)
                            .filter(([_, value]) => value)
                            .map(
                              ([key]) =>
                                key.charAt(0).toUpperCase() + key.slice(1)
                            )
                            .join(", ")}
                        </p>
                      </li>
                    ))}
                </ul>
                <div className="home-edit-button-container">
                  <button
                    className="home-edit-button"
                    onClick={handleEditDetail}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="home-remove-image-button"
                    onClick={() => handleDeleteData(selectedData.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Getdata;