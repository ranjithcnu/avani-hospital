import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/components/login'; // Ensure you have created this component


function App() {
  return (
    <Router>
      <div className="App">
      
        <Routes>
          <Route path="/" element={<LoginPage />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
