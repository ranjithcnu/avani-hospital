import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import '../styles/home.css';
//import fulllogo from '../styles/full_logo.jpg';
import tellogo from '../styles/avaniTellogo.jpg';
import englogo from '../styles/avaniEnlogo.jpg';
//import watermarkImage from '../styles/logo.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientname: '',
    mobile: '',
    visitedfrom:'',
    age:'',
    blood_pressure: '',
    gender: '',
    department:'',
    doctors_names:'',
  });
  // Removed the serialNumber state since it is now passed directly to handlePrint

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Ensure mobile value is exactly 10 digits
    if (name === 'mobile' && /^\d{0,10}$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      } else if (name !== 'mobile') {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    };
const goToDashboard = () => {
  navigate('/dashboard');
}
  // Function to get the current date in dd-mm-yyyy format
  const getCurrentDate = () => {
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0
    const yyyy = currentDate.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = getCurrentDate();
    const dataToSend = {
      ...formData,
      dateofvisit: currentDate,
    };
    try {
      const response = await fetch('http://localhost:5000/addpatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const responseData = await response.json(); // Get the JSON response body
      if (responseData.success) {
        // Patient added successfully, now get the serial number
        const serialNumberResponse = await fetch('http://localhost:5000/getserialnumber');
        const serialNumberData = await serialNumberResponse.json();
        alert(`Patient added successfully. Serial Number: ${serialNumberData.serialNumber}`);
        handlePrint(serialNumberData.serialNumber,
          formData.age, 
          formData.patientname, 
          formData.blood_pressure, 
          formData.gender,
          formData.department,
          formData.doctors_names,
          currentDate); // Pass required data to handlePrint
        
        // Reset form and close popup
        setFormData({
          patientname: '',
          mobile: '',
          visitedfrom:'',
          age:'',
          blood_pressure: '',
          gender: '',
          department:'',
          doctors_names:'',
        });
        setShowModal(false);
      } else {
        // Display error message
        alert(responseData.message || 'Failed to add patient'); // Use the message from the response
      }
    } catch (error) {
      alert('An error occurred');
      console.error('There was an error!', error);
    }
  };

// Function to handle logout
const handleLogout = () => {
    // Clear the data or perform any other logout-related tasks
    navigate('/');
  };

  // Check if the user is authenticated
  const isAuthenticated = true; // Replace with your authentication logic

  // Use useEffect to check authentication when the component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // If not authenticated, we've already redirected, so return null
    return null;
  }

  const handlePrint = (serialNumber, age, patientName, blood_pressure, gender,department,doctors_names, currentDate) => {
    // Render the component to a string
    const printContent = ReactDOMServer.renderToString(
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p><strong>Patient Name:</strong> {patientName}</p>
            <p><strong>Patient Age:</strong> {age}</p>
            <p><strong>Blood Pressure:</strong> {blood_pressure}</p>
            <p><strong>Gender:</strong> {gender}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p><strong>Date:</strong> {currentDate}</p>
            <p><strong>Department:</strong> {department}</p>
            <p><strong>Doctors Name:</strong> {doctors_names}</p>
            <p><strong>Token Number:</strong> {serialNumber}</p>
          </div>
        </div>
      </div>
    );
  
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=1200,height=600');
  
    // Write the content to the new window, including the print button
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Print</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
          }
          .image-header-container {
            text-align: center;
            background: url('${tellogo}') no-repeat center center; 
            background-size: contain;
            height: 200px;
            width: 100%;
          }
          .content { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 20px; 
            padding: 0 10px;
          }
          .content div { 
            flex: 1; 
          }
          .content div:last-child { 
            text-align: right; 
          }
          .watermark {
            position: fixed;
            top: 60%;
            left: 0;
            right: 0;
            text-align: center;
            transform: translateY(-50%);
            height: 150px; 
            background: url('${englogo}') no-repeat center center;
            background-size: contain;
            opacity: 0.5;
            z-index: -1; /* Send the watermark to the back */
          }
          .footer-text {
            text-align: center;
            position: fixed;
            width: 100%;
            bottom: 10px; /* Adjust based on your footer height */
            left: 0;
            font-size: small; /* Small text for the footer */
          }
          .print-button-container {
            text-align: center;
            position: fixed;
            width: 100%;
            bottom: 20px;
            left: 0;
          }
          .print-button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          
          @media print {
            /* Include the watermark and images in the print */
            .image-header-container {
                background-image: url('${tellogo}') !important;
              }
            .watermark{
                background-image: url('${englogo}') !important;
            }, 
            /* Hide the print button in print mode */
            .print-button-container {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="image-header-container"></div>
        <hr />
        <div class="content">
          ${printContent}
        </div>
        <hr />
        <div class="watermark"></div>
        <div class="footer-text">
        <hr /> <!-- Horizontal line directly above the footer text -->
        AVANI ORTHO & TRAUMA CARE HOSPITAL, NARSAMPET, beside CTO OFFICE, Telangana 506132 Contact:7299666222.
      </div>
 <div class="print-button-container">
          <button class="print-button" onclick="printDocument()">Print</button>
        </div>
        <script>
          function printDocument() {
            // This will remove the print button before printing
            document.querySelector('.print-button-container').style.display = 'none';
            window.print();
            // This will re-display the print button after printing dialog is closed
            window.onafterprint = function(){
              document.querySelector('.print-button-container').style.display = 'block';
            }
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };
  
    
    return (
        <div className="home">
        <header className="header-bar">
            <h1>AVANI HOSPITAL</h1>
            <button className="logout-button" onClick={handleLogout}>
            Logout
            </button>

        </header>

        <div className="buttons">
            {/* Button to show the modal */}
            <button className="animated-button" onClick={() => setShowModal(true)}>
            OP QUEUE
            </button>

            {/* Modal */}
            {showModal && (
            <div className="modal">
                <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>
                    &times;
                </span>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="patientname">Name</label>
                    <input
                        type="text"
                        name="patientname"
                        id="patientname"
                        placeholder="Patient Name"
                        value={formData.patientname}
                        onChange={handleInputChange}
                    required/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input
                         type="text" // Change input type to "number"
                         name="mobile"
                         id="mobile"
                         placeholder="Mobile"
                         value={formData.mobile}
                         onChange={handleInputChange}
                         maxLength={10} // Set maximum length to 10
                         required
                />
                    </div>

                    <div className="form-group">
                    <label htmlFor="visitedfrom">Visited From</label>
                    <input
                        type="text"
                        name="visitedfrom"
                        id="visitedfrom"
                        placeholder="Visited From"
                        value={formData.visitedfrom}
                        onChange={handleInputChange}
                        required/>
                    </div>


                    <div className="form-group">
                    <label htmlFor="age">AGE</label>
                    <input
                        type="text"
                        name="age"
                        id="age"
                        placeholder="AGE "
                        value={formData.age}
                        onChange={handleInputChange}
                        required/>
                    </div>

                    <div className="form-group">
                    <label htmlFor="blood_pressure">Blood Pressure</label>
                    <input
                        type="text"
                        name="blood_pressure"
                        id="blood_pressure"
                        placeholder="Blood Pressure"
                        value={formData.blood_pressure}
                        onChange={handleInputChange}
                        required/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      name="gender"
                      id="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required> 
                      <option value="">Select Gender</option> 
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required> 
                      <option value="">Select Department</option> 
                      <option value="orthopedic">Orthopedic</option>
                      <option value="general_surgery">General Surgery</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="physiotherapy">Physiotherapy</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label htmlFor="doctors_names">Doctors Names</label>
                    <select
                      name="doctors_names"
                      id="doctors_names"
                      value={formData.doctors_names}
                      onChange={handleInputChange}
                      required> 
                      <option value="">Select Doctor</option> 
                      <option value="Dr.J_Rajesh_MS">Dr.J Rajesh MS</option>
                      <option value="Dr.G_Surender_MS">Dr.G Surender MS</option>
                      <option value="Dr.B_Chinni_Krishna">Dr.B Chinni Krishna</option>
                      <option value="Dr.B_Anil_BPT">Dr.B Anil BPT</option>
                    </select>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                </div>
            </div>
            )}

            <button className="animated-button" >LAB REPORTS</button>
            <button className="animated-button" onClick={goToDashboard}>
        DASHBOARD
      </button>
        </div>

        {/* Footer added here */}
        <footer className="footer-bar">
            <p>© 2024 AVANI HOSPITAL. All rights reserved.</p>
        </footer>
        </div>
    );
    };

    export default Home;
