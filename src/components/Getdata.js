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
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Getdata() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [downloadStartDate, setDownloadStartDate] = useState("");
  const [downloadEndDate, setDownloadEndDate] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDateForm, setShowDateForm] = useState(false);
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
    setData([]);
    setShowDownload(false);
    checkLoginStatus();
    fetchData(currentPage);
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
      const data = await response.data;
      if (data.message === "Successfully getting Prescription Record!") {
        setRecords(data.data);
        setTotalPages(Math.ceil(data.total_count / recordsPerPage)); // Calculate total pages
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
    setDownloadStartDate(startDate);
    setDownloadEndDate(endDate);

    if (startDate) {
      const filtered = allData.filter((item) => {
        const itemDate = new Date(item.prescription_date);
        const start = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
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
      downloadData = downloadData.filter((item) => {
        const itemDate = new Date(item.prescription_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (downloadData.length === 0) {
      alert("No data to download.");
      return;
    }
    const exportData = downloadData.map((item) => ({
      "Patient Name": item.patient_name,
      Date: item.prescription_date,
      Medications: item.medications.map((med) => med.name).join(", "),
      Timing: item.medications.map((med) => getTimingText(med)).join(", "),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prescription Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const toggleDateForm = () => {
    setShowDateForm(!showDateForm);
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
      await sendEditedDataToBackend(updatedData);
      setData((prevData) =>
        prevData.map((item) =>
          item.id === updatedData.id ? updatedData : item
        )
      );

      setAllData((prevAllData) =>
        prevAllData.map((item) =>
          item.id === updatedData.id ? updatedData : item
        )
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((item) =>
          item.id === updatedData.id ? updatedData : item
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
        `https://bharati-clinic-test.vercel.app/prescription/`, // Add id as query param
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            action: "delPrescriptionRecord",
            id: id,
          }, // Include body for delete request
        }
      );

      setData((prevData) => prevData.filter((item) => item.id !== id));
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
    setEditFormData((prevData) => ({ ...prevData, [key]: value }));
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
  
  const handleBack = () => {
    setSelectedData(null);
    setEditFormData(null);
  };

  const handleHideDateForm = () => {
    setShowDateForm(false);
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

      <h1 className="mb-4 text-center">Get Data</h1>
      {/* slide one */}
      {!showFilterSlide && (
        <div className="mt-4 text-center">
          <button
            className="show-date-form-button"
            onClick={() => setShowFilterSlide(true)}
          >
            <FaFilter />
          </button>
          <div className="table-header">
            <h2 className="mb-3">Prescription Data</h2>
            <div className="back-to-home-button-container">
              <button
                className="back-to-home-button"
                onClick={handleBackToHome}
              >
                Back to Home
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Medications</th>
                  <th>Timing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
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
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Medications</th>
                    <th>Timing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
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
              <h2 className="middle-text">Prescription Details</h2>
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
                    Date:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    style={{ zIndex: 10000 }}
                    value={editFormData?.prescription_date || ""}
                    onChange={(e) => handleInputChange(e, "prescription_date")}
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
                                handleInputChange(e, "name", index)
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
                  <strong>Date:</strong> {selectedData.prescription_date}
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
