// import React, { useEffect, useState } from "react";
// import About from "./About";
// import Contact from "./Contact";
// import CameraCapture from "./CameraCapture";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera } from "@fortawesome/free-solid-svg-icons"; // Import camera icon

// const Home = () => {
//   const [loggedInUser, setLoggedInUser] = useState("");
//   const [isCameraVisible, setIsCameraVisible] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem("loggedInUser");
//     setLoggedInUser(user);
//   }, []);

//   const toggleCamera = () => {
//     setIsCameraVisible((prev) => !prev);
//   };

//   return (
//     <>
//       {/* Camera Toggle Button (Fixed Position) */}
//       <div className="camera-button-container">
//         <button className="camera-toggle" onClick={toggleCamera}>
//           <FontAwesomeIcon
//             icon={faCamera}
//             style={{ fontSize: "1.5rem" }}
//           />
//         </button>
//       </div>
//       {/* CameraCapture Component */}
//       {isCameraVisible && (
//         <CameraCapture
//           closeCamera={() => setIsCameraVisible(false)} // Close the camera after photo capture
//         />
//       )}

//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <div className="hero-text">
//             <h1>Welcome to Medilab</h1>
//             <p>Your trusted medical care provider.</p>
//           </div>

//           {/* Cards Section */}
//           <div className="cards-section">
//             <div className="card"  style={{ backgroundColor: "#1c75c4" }}>
//               <h2>Why Choose Medilab</h2>
//               <p>
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
//                 do eiusmod tempor incididunt ut labore et dolore magna
//                 aliqua. Duis aute irure dolor in reprehenderit asperiores
//                 dolores sed et. Tenetur quia eos. Autem tempore quibusdam vel
//                 necessitatibus optio ad corporis.
//               </p>
//               <a href="#about" className="learn-more-btn">
//                 Learn More
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section
//         id="about"
//         style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}
//       >
//         <About />
//       </section>

//       {/* Contact Section */}
//       <section id="contact" style={{ padding: "50px 20px" }}>
//         <Contact />
//       </section>

//       {/* Greeting */}
//       {/* <div style={{ textAlign: 'center', margin: '20px' }}>
//           {loggedInUser && <h2>Welcome, {loggedInUser}!</h2>}
//         </div> */}
//     </>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import About from "./About";
import Contact from "./Contact";
import CameraCapture from "./CameraCapture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [apiData, setApiData] = useState(null); // State to hold the API data

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setLoggedInUser(user);
  }, []);

  const toggleCamera = () => {
    
    setIsCameraVisible((prev) => !prev);
  };

  // Callback function to receive data from CameraCapture
  const handleDataReceived = (data) => {
      setApiData(data);
  };

  return (
    <>
      {/* Camera Toggle Button (Fixed Position) */}
      <div className="camera-button-container">
        <button className="camera-toggle" onClick={toggleCamera}>
          <FontAwesomeIcon
            icon={faCamera}
            style={{ fontSize: "1.5rem" }}
          />
        </button>
      </div>
      {/* CameraCapture Component */}
      {isCameraVisible && (
        <CameraCapture
          closeCamera={() => setIsCameraVisible(false)}
          onDataReceived={handleDataReceived}
        />
      )}

      {/* Display data from API */}
      {apiData && (
        <div className="api-data-display">
            <h2>Prescription Photo data:</h2>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
           {apiData.image_url && (
               <img src={apiData.image_url} alt="Processed"  style={{maxWidth: '500px', maxHeight:'500px', width:'100%', height: 'auto'}}/>
          )}
        </div>
      )}
        
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Medilab</h1>
            <p>Your trusted medical care provider.</p>
          </div>

          {/* Cards Section */}
          <div className="cards-section">
            <div className="card" style={{ backgroundColor: "#1c75c4" }}>
              <h2>Why Choose Medilab</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Duis aute irure dolor in reprehenderit asperiores
                dolores sed et. Tenetur quia eos. Autem tempore quibusdam vel
                necessitatibus optio ad corporis.
              </p>
              <a href="#about" className="learn-more-btn">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}
      >
        <About />
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: "50px 20px" }}>
        <Contact />
      </section>
    </>
  );
};

export default Home;