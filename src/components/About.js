import React from "react";

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about-title-container">
          <h3 className="about-title">About Us</h3>
        </div>
        <div className="row gy-4 gx-5">
          <div
            className="col-lg-6 content"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <p>
              Bharti Clinic is a dedicated healthcare center specializing in
              Neuropsychiatry, providing expert diagnosis and treatment for
              mental health and neurological conditions. Led by a highly
              qualified doctor with MBBS, DNB, DPM, and MA degrees, we focus on
              delivering compassionate and effective care to enhance the
              well-being of our patients.{" "}
            </p>
            <ul>
              <li>
                <i className="fa-solid fa-vial-circle-check"></i>
                <div>
                  <h5>Our Specialization</h5>
                  <p>
                    We specialize in Neuropsychiatry, addressing various mental
                    health disorders, neurological conditions, and emotional
                    well-being through personalized treatment plans.
                  </p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-pump-medical"></i>
                <div>
                  <h5>Clinic Details</h5>
                  <p>📍 Address: 327, Old LIC Building, Kulkarni Plot, Behind
                    Court No. 2 Petrol Pump, Bhusawal.</p> 
                    <p>⏰ Timings: Monday to
                    Friday & Sunday – 10:00 AM to 1:00 PM </p>
                    <p>🚫 Closed on: Saturday
                    & Tuesday</p>
                   <p> At Bharti Clinic, we are committed to improving
                    mental health and neurological care with expertise and
                    compassion. Visit us for specialized and patient-centered
                    treatment.
                  </p>
                </div>
              </li>
              {/* <li>
                <i className="fa-solid fa-heart-circle-xmark"></i>
                <div>
                  <h5>Voluptatem et qui exercitationem</h5>
                  <p>
                    Et velit et eos maiores est tempora et quos dolorem autem
                    tempora incidunt maxime veniam
                  </p>
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
