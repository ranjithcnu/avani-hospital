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
  const [validationMessages, setValidationMessages] = useState({
    mobile: '',
    blood_pressure: '',
  });
  const [formData, setFormData] = useState({
    patientname: '',
    mobile: '',
    visitedfrom:'',
    age:'',
    blood_pressure: '/',
    gender: '',
    department:'',
    doctors_names:'',
  });
  
const departmentDoctorsMap = {
  Orthopedic: ["Dr.J Rajesh MS" ],
  General_surgery: ["Dr.G Surender MS"],
  Psychiatry: ["Dr.B Chinni Krishna"],
  Physiotherapy: ["Dr.B Anil BPT"],
};

// Modified handleInputChange to handle department change
const handleInputChanges = (e) => {
  const { name, value } = e.target;

  if (name === "department") {
    // Reset doctors_names when department changes
    setFormData({
      ...formData,
      department: value,
      doctors_names: '',
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Handle mobile number input
      // Handle mobile number input
  if (name === 'mobile') {
    const newValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (newValue.length <= 10) {
      setFormData({ ...formData, [name]: newValue });
    }

    // Update validation message based on the mobile number length
    if (newValue.length < 10) {
      setValidationMessages({ ...validationMessages, mobile: 'Mobile number must be 10 digits.' });
    } else if (newValue.length === 10) {
      setValidationMessages({ ...validationMessages, mobile: '' }); // Clear message if exactly 10 digits
    } else {
      // This case may be redundant due to the <= 10 condition, but kept for clarity
      setValidationMessages({ ...validationMessages, mobile: 'Mobile number cannot exceed 10 digits.' });
    }
  } else  if (name === 'age') {
      // Your existing logic for age validation...
      const newValue = value.replace(/[^0-9]/g, ''); // Ensure only numbers
      if (newValue === '' || (newValue > 0 && newValue <= 100)) {
        setFormData({ ...formData, age: newValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  



  const handleBloodPressureChange = (e) => {
    let inputValue = e.target.value.replace(/[^\d/]/g, ''); // Allow only digits and "/"
    
    // Ensure "/" is correctly positioned between numbers
    if (!inputValue.includes('/')) {
      if (inputValue.length > 3) {
        // Automatically insert "/" after 3 digits if not present and length exceeds 3
        inputValue = `${inputValue.slice(0, 3)}/${inputValue.slice(3)}`;
      }
    } else {
      // Split and enforce digit limits for both parts
      let [systolic, diastolic] = inputValue.split('/');
      systolic = systolic.substring(0, 3); // Limit systolic part to 3 digits
      diastolic = (diastolic || '').substring(0, 3); // Limit diastolic part to 3 digits
      inputValue = `${systolic}/${diastolic}`;
    }
  
    setFormData({ ...formData, blood_pressure: inputValue });
  
    // Validate format and provide feedback
    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (bpPattern.test(inputValue) || inputValue === "") {
      // Valid format or empty input
      setValidationMessages({ ...validationMessages, blood_pressure: '' }); // Clear message if valid
    } else {
      // Potential invalid format - gentle reminder
      setValidationMessages({ ...validationMessages, blood_pressure: 'Format: XX/XX or XXX/XXX' });
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
   // Example validation for mobile number length on submission
   if (formData.mobile.length !== 10) {
    setValidationMessages({ ...validationMessages, mobile: 'Please enter a valid 10-digit mobile number.' });
    return; // Prevent form submission
  }

  // Clear validation messages upon successful validation
  setValidationMessages({ mobile: '' });
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
      // Patient added successfully, now get the serial number for the specific doctor
      const serialNumberResponse = await fetch(`http://localhost:5000/getserialnumber?doctors_name=${encodeURIComponent(formData.doctors_names)}`);
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left', width: '25%' }}><strong>Patient Name:</strong></td>
              <td style={{ textAlign: 'left', width: '25%' }}>{patientName}</td>
              <td style={{ textAlign: 'left', width: '25%' }}><strong>Date:</strong></td>
              <td style={{ textAlign: 'left', width: '25%' }}>{currentDate}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}><strong>Patient Age:</strong></td>
              <td>{age}</td>
              <td><strong>Department:</strong></td>
              <td>{department}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}><strong>Blood Pressure:</strong></td>
              <td>{blood_pressure}</td>
              <td><strong>Doctor's Name:</strong></td>
              <td>{doctors_names}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}><strong>Gender:</strong></td>
              <td>{gender}</td>
              <td><strong>Token Number:</strong></td>
              <td>{serialNumber}</td>
            </tr>
          </tbody>
        </table>
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
          margin: 20px; /* Adjust as needed for your printer settings */
          border: 1.5px solid #4CAF50; /* Example of a hospital-themed border */
          padding: 20px;
          border-radius: 5px;
          height: calc(100% - 10px); /* Adjust height to account for margin and border */
          box-sizing: border-box;
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
          .content table {
            border: 1.5px solid #4CAF50; /* Hospital theme colored border for the table */
            margin-bottom: 20px;
          }
          .content td {
            border-bottom: 1px solid #ccc; /* Lighter border for table cells */
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
            body {
              margin: 0;
              border: 1px solid #4CAF50; /* Ensure border is visible in print */
            }
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}>+91</span>
                        <input
                          type="text"
                          name="mobile"
                          id="mobile"
                          placeholder="Mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                        />
                        {validationMessages.mobile && <div style={{ color: 'red' }}>{validationMessages.mobile}</div>}
                  </div>
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
                        placeholder="Age "
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
                        value={formData.blood_pressure}
                        onChange={handleBloodPressureChange}
                        required
                      />
                      {validationMessages.blood_pressure && (
                          <div style={{ color: 'red', marginTop: '5px' }}>
                            {validationMessages.blood_pressure}
                          </div>
                        )}

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
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
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
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="General_surgery">General Surgery</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Physiotherapy">Physiotherapy</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label htmlFor="doctors_names">Doctors Names</label>
                    <select
                      name="doctors_names"
                      id="doctors_names"
                      value={formData.doctors_names}
                      onChange={handleInputChanges}
                      required>
                      <option value="">Select Doctor</option>
                      {formData.department && departmentDoctorsMap[formData.department].map(doctor => (
                        <option key={doctor} value={doctor}>{doctor}</option>
                      ))}
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
