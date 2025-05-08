import React, { useState } from 'react';
import Head from 'next/head';
import { FaBuilding, FaUserGraduate, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes, FaSave, FaFileExcel } from 'react-icons/fa';
import Vcet from './assets/VCET Logo.jpg';
import CSE from './assets/CSE LOGO.jpg';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
    const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
    const [companies, setCompanies] = useState([
        {
            id: 1,
            name: "Google",
            description: "Software Development Engineer",
            position: "SDE",
            tenth: 75,
            twelfth: 75,
            cgpa: 7.5,
            historyArrears: "none",
            currentArrears: "none",
            interviewDate: "2024-03-15"
        },
        {
            id: 2,
            name: "Microsoft",
            description: "Full Stack Developer",
            position: "FSD",
            tenth: 70,
            twelfth: 70,
            cgpa: 7.0,
            historyArrears: "1",
            currentArrears: "none",
            interviewDate: "2024-03-20"
        },
        {
            id: 3,
            name: "Amazon",
            description: "Cloud Solutions Architect",
            position: "CSA",
            tenth: 80,
            twelfth: 80,
            cgpa: 8.0,
            historyArrears: "none",
            currentArrears: "none",
            interviewDate: "2024-03-25"
        }
    ]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyPopup, setShowCompanyPopup] = useState(false);

    // Make students state mutable
    const [students, setStudents] = useState([
        { 
            id: 1, 
            name: "John Doe", 
            rounds: { 
                1: { round1: "pending", round2: "pending", round3: "pending" },
                2: { round1: "pending", round2: "pending", round3: "pending" },
                3: { round1: "pending", round2: "pending", round3: "pending" }
            } 
        },
        { 
            id: 2, 
            name: "Jane Smith", 
            rounds: { 
                1: { round1: "pending", round2: "pending", round3: "pending" },
                2: { round1: "pending", round2: "pending", round3: "pending" },
                3: { round1: "pending", round2: "pending", round3: "pending" }
            } 
        },
        { 
            id: 3, 
            name: "Alex Lee", 
            rounds: { 
                1: { round1: "pending", round2: "pending", round3: "pending" },
                2: { round1: "pending", round2: "pending", round3: "pending" },
                3: { round1: "pending", round2: "pending", round3: "pending" }
            } 
        }
    ]);

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
        const form = e.target;
        const newCompany = {
            id: Date.now(),
            name: form[0].value,
            description: form[1].value,
            position: form[2].value,
            tenth: form[3].value,
            twelfth: form[4].value,
            cgpa: form[5].value,
            historyArrears: form[6].value,
            currentArrears: form[7].value,
            interviewDate: form[8].value
        };
        setCompanies([...companies, newCompany]);
        setShowAddCompanyForm(false);
        form.reset();
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        setShowCompanyPopup(true);
    };

    const calculateFinalStatus = (rounds) => {
        const roundStatuses = Object.values(rounds);
        if (roundStatuses.some(status => status === 'rejected')) {
            return 'rejected';
        }
        if (roundStatuses.every(status => status === 'selected')) {
            return 'selected';
        }
        return 'pending';
    };

    const handleRoundStatusChange = (studentId, round, currentStatus) => {
        // If any previous round is rejected, don't allow changes
        const student = students.find(s => s.id === studentId);
        const rounds = student.rounds[selectedCompany.id] || {};
        const roundNumber = parseInt(round.replace('round', ''));
        
        // Check if any previous round is rejected
        for (let i = 1; i < roundNumber; i++) {
            if (rounds[`round${i}`] === 'rejected') {
                return; // Don't allow changes if a previous round is rejected
            }
        }

        // Cycle through the statuses: pending -> selected -> rejected -> pending
        const statusOrder = ['pending', 'selected', 'rejected'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

        // Update the student's round status
        setStudents(prevStudents => 
            prevStudents.map(student => {
                if (student.id === studentId) {
                    const updatedRounds = {
                        ...student.rounds,
                        [selectedCompany.id]: {
                            ...student.rounds[selectedCompany.id],
                            [round]: nextStatus
                        }
                    };
                    
                    // If this round is rejected, mark all further rounds as rejected
                    if (nextStatus === 'rejected') {
                        for (let i = roundNumber + 1; i <= 3; i++) {
                            updatedRounds[selectedCompany.id][`round${i}`] = 'rejected';
                        }
                    }
                    
                    // Calculate final status
                    const finalStatus = calculateFinalStatus(updatedRounds[selectedCompany.id]);
                    
                    return {
                        ...student,
                        rounds: updatedRounds,
                        finalStatus: {
                            ...student.finalStatus,
                            [selectedCompany.id]: finalStatus
                        }
                    };
                }
                return student;
            })
        );
  };

  return (
    <div className="min-h-screen bg-gradient-animation p-4 relative overflow-hidden">
      <Head>
        <title>VCET Placement Portal | Admin Dashboard </title>
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
        <button 
                  className={`admin-nav-button ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
                  <FaBuilding className="admin-nav-icon" />
            Manage Companies
          </button>
          <button 
                  className={`admin-nav-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
                  <FaUserGraduate className="admin-nav-icon" />
            Manage Students
          </button>
              <button className="admin-nav-button logout" onClick={handleLogout}>
                  <FaSignOutAlt className="admin-nav-icon" />
                  Logout
              </button>
      </div>

          {/* Dashboard Content */}
          <div className="admin-dashboard-content">
              {activeTab === 'companies' ? (
                  <div className="admin-companies-section">
                      <div className="admin-section-header">
                          <h2>Companies</h2>
                          <button className="admin-add-company-btn high-contrast" onClick={() => setShowAddCompanyForm(true)}>
                              <FaPlus />
                    Add Company
                  </button>
                </div>

                          {showAddCompanyForm && (
                              <form className="admin-add-company-form" onSubmit={handleAddCompany}>
                                  <h3>Add New Company</h3>
                                  <div className="admin-form-group">
                                      <label className="admin-form-label">Company Name</label>
                                      <input type="text" className="admin-form-input" required />
                                  </div>
                                  <div className="admin-form-group">
                                      <label className="admin-form-label">Description</label>
                                      <textarea className="admin-form-textarea" required></textarea>
                                  </div>
                                  <div className="admin-form-group">
                                      <label className="admin-form-label">Position Recruiting</label>
                                      <input type="text" className="admin-form-input" required />
                                  </div>
                                  <div className="admin-criteria-container">
                                      <h4 className="admin-academic-req-heading">Academic Requirements</h4>
                                      <div className="admin-criteria-row">
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">10th Percentage</label>
                                              <input type="number" className="admin-form-input" required />
                        </div>
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">12th Percentage</label>
                                              <input type="number" className="admin-form-input" required />
                        </div>
                      </div>
                                      <div className="admin-criteria-row">
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">CGPA</label>
                                              <input type="number" className="admin-form-input" step="0.01" required />
                                        </div>
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">History of Arrears</label>
                                              <select className="admin-form-select" required>
                                                  <option value="none">None</option>
                                                  <option value="1">1</option>
                                                  <option value="2">2</option>
                                                  <option value="3">3</option>
                                              </select>
                                        </div>
                                      </div>
                                      <div className="admin-criteria-row">
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">Current Arrears</label>
                                              <select className="admin-form-select" required>
                                                  <option value="none">None</option>
                                                  <option value="1">1</option>
                                                  <option value="2">2</option>
                                              </select>
                                        </div>
                                          <div className="admin-criteria-item">
                                              <label className="admin-form-label">Date of Interview</label>
                                              <input type="date" className="admin-form-input" required />
                                        </div>
                                      </div>
                                    </div>
                                  <div className="admin-form-actions">
                                      <button type="button" className="admin-form-button high-contrast" onClick={() => setShowAddCompanyForm(false)}>
                                          Cancel
                                      </button>
                                      <button type="submit" className="admin-form-button">
                                          Add Company
                                      </button>
                                  </div>
                              </form>
                          )}

                          <div className="admin-companies-grid">
                              {companies.map((company) => (
                                  <div 
                                      className="admin-company-card" 
                                      key={company.id}
                                      onClick={() => handleCompanyClick(company)}
                                  >
                                      <div className="admin-company-header">
                                          <h3>{company.name}</h3>
                                          <div className="admin-company-actions">
                                              <button className="admin-action-btn">
                                                  <FaEdit />
                                              </button>
                                              <button className="admin-action-btn delete">
                                                  <FaTrash />
                                              </button>
                                          </div>
                                      </div>
                                      <div className="admin-company-details">
                                          <p><strong>Position:</strong> {company.position}</p>
                                          <p><strong>Description:</strong> {company.description}</p>
                                          <p><strong>Requirements:</strong></p>
                                          <ul>
                                              <li>10th: {company.tenth}%</li>
                                              <li>12th: {company.twelfth}%</li>
                                              <li>CGPA: {company.cgpa}</li>
                                              <li>History of Arrears: {company.historyArrears}</li>
                                              <li>Current Arrears: {company.currentArrears}</li>
                                              <li>Date of Interview: {company.interviewDate}</li>
                                          </ul>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ) : (
                      <div className="admin-students-section">
                          <div className="admin-section-header">
                              <h2>Students</h2>
                              <button 
                                  className="admin-excel-button"
                                  onClick={() => {
                                      alert('Exporting to Excel...');
                                  }}
                              >
                                  <FaFileExcel className="admin-excel-icon" />
                                  Import to Excel
                              </button>
                          </div>
                          <div className="admin-students-table-container">
                              <table className="admin-students-table">
                                  <thead>
                                      <tr>
                                          <th>S. No.</th>
                                          <th>Name</th>
                                          {companies.map((company, idx) => (
                                              <th key={idx}>{company.name}</th>
                                          ))}
                                          <th className="admin-remove-column">Remove</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {students.map((student, sIdx) => (
                                          <tr key={sIdx}>
                                              <td>{sIdx + 1}</td>
                                              <td>{student.name}</td>
                                              {companies.map((company) => {
                                                  const rounds = student.rounds[company.id] || {};
                                                  const selectedCount = Object.values(rounds).filter(status => status === 'selected').length;
                                                  const rejectedCount = Object.values(rounds).filter(status => status === 'rejected').length;
                                                  
                                                  return (
                                                      <td key={company.id}>
                                                          <div className={`status-pill ${
                                                              rejectedCount > 0 ? 'status-rejected' : 
                                                              selectedCount > 0 ? 'status-selected' : 'status-pending'
                                                          }`}>
                                                              {rejectedCount > 0 ? 'Rejected' : 
                                                               selectedCount > 0 ? `${selectedCount} Rounds Selected` : 'Pending'}
                                                          </div>
                                                      </td>
                                                  );
                                              })}
                                              <td className="admin-remove-column">
                                                  <button className="admin-action-btn delete" title="Remove Student">
                                                      <FaTrash />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>

              {/* Company Details Popup */}
              {showCompanyPopup && selectedCompany && (
                  <div className="admin-company-popup">
                      <div className="admin-company-popup-content">
                          <div className="admin-popup-header">
                              <h2 className="admin-popup-title">{selectedCompany.name} - Students</h2>
                              <div className="admin-popup-actions">
                                  <button 
                                      className="admin-save-button"
                                      onClick={() => {
                                          // Here you would typically save to a backend
                                          alert('Changes saved successfully!');
                                          setShowCompanyPopup(false);
                                      }}
                                  >
                                      <FaSave className="admin-save-icon" />
                                      Save Changes
                                  </button>
                                  <button 
                                      className="admin-excel-button"
                                      onClick={() => {
                                          // Handle Excel export
                                          alert('Exporting to Excel...');
                                      }}
                                  >
                                      <FaFileExcel className="admin-excel-icon" />
                                      Import to Excel
                                  </button>
                                  <button 
                                      className="admin-popup-close"
                                      onClick={() => setShowCompanyPopup(false)}
                                  >
                                      <FaTimes />
                                  </button>
                              </div>
                          </div>

                          <div className="admin-students-table-container">
                              <table className="admin-rounds-table">
                                  <thead>
                                      <tr>
                                          <th>Student Name</th>
                                          <th>Round 1</th>
                                          <th>Round 2</th>
                                          <th>Round 3</th>
                                          <th>Final Status</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {students.map(student => (
                                          <tr key={student.id}>
                                              <td>{student.name}</td>
                                              <td>
                                                  <div 
                                                      className={`admin-round-status ${student.rounds[selectedCompany.id]?.round1 || 'pending'}`}
                                                      onClick={() => handleRoundStatusChange(
                                                          student.id, 
                                                          'round1', 
                                                          student.rounds[selectedCompany.id]?.round1 || 'pending'
                                                      )}
                                                  >
                                                      {student.rounds[selectedCompany.id]?.round1 || 'Pending'}
                                                  </div>
                                              </td>
                                              <td>
                                                  <div 
                                                      className={`admin-round-status ${student.rounds[selectedCompany.id]?.round2 || 'pending'}`}
                                                      onClick={() => handleRoundStatusChange(
                                                          student.id, 
                                                          'round2', 
                                                          student.rounds[selectedCompany.id]?.round2 || 'pending'
                                                      )}
                                                  >
                                                      {student.rounds[selectedCompany.id]?.round2 || 'Pending'}
                                                  </div>
                                              </td>
                                              <td>
                                                  <div 
                                                      className={`admin-round-status ${student.rounds[selectedCompany.id]?.round3 || 'pending'}`}
                                                      onClick={() => handleRoundStatusChange(
                                                          student.id, 
                                                          'round3', 
                                                          student.rounds[selectedCompany.id]?.round3 || 'pending'
                                                      )}
                                                  >
                                                      {student.rounds[selectedCompany.id]?.round3 || 'Pending'}
                                                  </div>
                                              </td>
                                              <td>
                                                  <div className={`admin-round-status ${student.finalStatus?.[selectedCompany.id] || 'pending'}`}>
                                                      {student.finalStatus?.[selectedCompany.id] || 'Pending'}
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              )}
      </div>
  </div>
);
};

export default AdminDashboard; 