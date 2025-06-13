import React, { useState } from 'react';
import Head from 'next/head';
import { FaFileExcel, FaSignOutAlt, FaChevronDown, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Vcet from './assets/VCET Logo.jpg';
import CSE from './assets/CSE LOGO.jpg';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data for previous batches - replace with actual data from your backend
  const previousBatches = [
    { id: 1, startYear: 2020, endYear: 2024 },
    { id: 2, startYear: 2019, endYear: 2023 },
    { id: 3, startYear: 2018, endYear: 2022 },
  ];

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      navigate('/admin/companies');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      navigate('/admin/companies');
    }
  };

  const handleBatchSelect = (batch) => {
    navigate('/admin/companies', { state: { batch } });
  };

  return (
    <div className="min-h-screen bg-gradient-animation p-4 relative overflow-hidden">
      <Head>
        <title>VCET Placement Portal | Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for managing student placements, company details, and recruitment processes at VCET" />
      </Head>

      <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 blob-1"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 blob-2"></div>
          <div className="absolute -bottom-40 left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 blob-3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
          {/* College Header */}
          <div className="admin-college-header">
              <img src={Vcet} alt="VCET Logo" className="admin-college-logo" />
              <div className="admin-college-info">
                  <h1 className="admin-college-name">Velammal College of Engineering and Technology</h1>
                  <p className="admin-college-subtitle">Department of Computer Science and Engineering</p>
                  <p className="admin-subtitle">Admin Portal</p>
              </div>
              <img src={CSE} alt="CSE Logo" className="admin-college-logo" />
          </div>

          {/* Navigation */}
          <div className="admin-navbar">
          <div className="batch-info">
                  <span className="batch-label">Batch:</span>
            <div className="admin-year-inputs">
                      <input
                          type="number"
                          value={startYear}
                          onChange={(e) => setStartYear(e.target.value)}
                          placeholder="Start Year"
                className="admin-year-input"
                      />
              <span className="admin-year-separator">-</span>
                      <input
                          type="number"
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          placeholder="End Year"
                className="admin-year-input"
                      />
                  </div>
              </div>

              <div 
            className={`admin-excel-import-container ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
              >
                  <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
              className="admin-excel-file-input"
                      id="excel-file"
                  />
                  <label htmlFor="excel-file" className="excel-import-button">
              <FaFileExcel className="admin-excel-icon" />
                      Import from Excel
                  </label>
              </div>

          <div className="admin-previous-batches">
                  <button 
              className="admin-previous-batches-button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                      <FaHistory className="admin-nav-icon" />
                      Previous Batches
              <FaChevronDown className={`admin-dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                  </button>
                  {isDropdownOpen && (
              <div className="admin-previous-batches-menu">
                          {previousBatches.map((batch) => (
                              <button
                                  key={batch.id}
                    className="admin-previous-batches-item"
                                  onClick={() => handleBatchSelect(batch)}
                              >
                                  {batch.startYear} - {batch.endYear}
                              </button>
                          ))}
                      </div>
                  )}
              </div>

              <button className="admin-nav-button logout" onClick={handleLogout}>
                  <FaSignOutAlt className="admin-nav-icon" />
                  Logout
              </button>
          </div>

          {/* Dashboard Content */}
          <div className="admin-dashboard-content">
              <div className="admin-welcome">
                  <h2>Welcome to Admin Dashboard</h2>
                  <p>Please import an Excel file to manage companies or select a previous batch to proceed.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 