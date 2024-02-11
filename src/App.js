import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/components/login'; // Ensure you have created this component

import Home from '../src/components/home';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <Router>
      <div className="App">
      
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
