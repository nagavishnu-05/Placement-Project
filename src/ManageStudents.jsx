import React, { useState, useEffect } from 'react';
import { FaFileExcel, FaTrash, FaBuilding, FaSignOutAlt, FaUsers, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Vcet from './assets/VCET Logo.jpg';
import CSE from './assets/CSE LOGO.jpg';
import './styles/ManageStudents.css';
import * as XLSX from 'xlsx';

const ManageStudents = () => {
    const location = useLocation();
    const batch = location.state?.batch;
    const [students, setStudents] = useState([
        { 
            id: 1, 
            name: "John Doe",
            rounds: {}
        },
        { 
            id: 2, 
            name: "Jane Smith",
            rounds: {}
        },
        { 
            id: 3, 
            name: "Alex Lee",
            rounds: {}
        },
        { 
            id: 4, 
            name: "Sarah Johnson",
            rounds: {}
        },
        { 
            id: 5, 
            name: "Michael Brown",
            rounds: {}
        }
    ]);

    const [showRoundDetails, setShowRoundDetails] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [companies, setCompanies] = useState([]);

    // Load student round details and companies from localStorage when component mounts
    useEffect(() => {
        const loadData = () => {
            const savedStudents = localStorage.getItem('studentRounds');
            const savedCompanies = localStorage.getItem('companies');
            
            if (savedCompanies) {
                const parsedCompanies = JSON.parse(savedCompanies);
                setCompanies(parsedCompanies);
            }
            
            if (savedStudents) {
                const parsedStudents = JSON.parse(savedStudents);
                setStudents(prevStudents => 
                    prevStudents.map(student => ({
                        ...student,
                        rounds: parsedStudents[student.id] || {}
                    }))
                );
            }
        };

        // Load initially
        loadData();

        // Set up an interval to check for updates
        const intervalId = setInterval(loadData, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        window.location.href = '/';
    };

    const handleViewRounds = (student) => {
        setSelectedStudent(student);
        setShowRoundDetails(true);
    };

    const calculateFinalStatus = (rounds, company) => {
        if (!rounds || !company) return 'Rejected';
        
        const companyRounds = rounds[company.id];
        if (!companyRounds) return 'Rejected';

        // Check if all rounds are selected
        const allRoundsSelected = Object.entries(companyRounds).every(
            ([round, status]) => status === 'selected'
        );

        return allRoundsSelected ? 'Selected' : 'Rejected';
    };

    const handleExportStudentRounds = (student) => {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        
        // Prepare data for export
        const exportData = [{
            'Student ID': student.id,
            'Student Name': student.name
        }];

        // Add company rounds data
        Object.entries(student.rounds).forEach(([companyId, rounds]) => {
            const company = companies.find(c => c.id === parseInt(companyId));
            if (company) {
                Object.entries(rounds).forEach(([round, status]) => {
                    exportData[0][`${company.name} - ${round.replace('round', 'Round ')}`] = 
                        status.charAt(0).toUpperCase() + status.slice(1);
                });
                // Add final status
                exportData[0][`${company.name} - Final Status`] = 
                    calculateFinalStatus(student.rounds, company);
            }
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, `${student.name}'s Rounds`);

        // Generate Excel file and trigger download
        XLSX.writeFile(wb, `${student.name}_Rounds_Report.xlsx`);
    };

    const handleExportAllStudents = () => {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        
        // Prepare data for export
        const exportData = students.map(student => {
            const row = {
                'Student ID': student.id,
                'Student Name': student.name
            };

            // Add company rounds data for all companies
            companies.forEach(company => {
                const companyRounds = student.rounds[company.id] || {};
                // Add all rounds for this company, defaulting to 'rejected' if not present
                for (let i = 1; i <= company.rounds; i++) {
                    const roundKey = `round${i}`;
                    row[`${company.name} - Round ${i}`] = 
                        (companyRounds[roundKey] || 'rejected').charAt(0).toUpperCase() + 
                        (companyRounds[roundKey] || 'rejected').slice(1);
                }
                // Add final status
                row[`${company.name} - Final Status`] = 
                    calculateFinalStatus(student.rounds, company);
            });

            return row;
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'All Students Rounds');

        // Generate Excel file and trigger download
        XLSX.writeFile(wb, 'All_Students_Rounds_Report.xlsx');
    };

    return (
        <div className="min-h-screen bg-gradient-animation p-4 relative overflow-hidden">
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
                        <FaUsers className="admin-nav-icon" />
                        <span className="batch-label">
                            {batch ? `Batch ${batch.startYear}-${batch.endYear}` : 'Students Management'}
                        </span>
                    </div>
                    <Link to="/admin/companies" className="admin-nav-button manage-companies">
                        <FaBuilding className="admin-nav-icon" />
                        Manage Companies
                    </Link>
                    <button className="admin-nav-button logout" onClick={handleLogout}>
                        <FaSignOutAlt className="admin-nav-icon" />
                        Logout
                    </button>
                </div>

                {/* Content Area */}
                <div className="admin-dashboard-content">
                    <div className="manage-students-header">
                        <h2 className="manage-students-title">Students</h2>
                        <div className="student-header-right">
                            <button className="student-export-btn" onClick={handleExportAllStudents}>
                                <FaFileExcel /> Export to Excel
                            </button>
                        </div>
                    </div>

                    <div className="student-table-container">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="student-view-rounds-btn"
                                                    onClick={() => handleViewRounds(student)}
                                                >
                                                    View Company Rounds
                                                </button>
                                                <button 
                                                    className="student-export-btn"
                                                    onClick={() => handleExportStudentRounds(student)}
                                                >
                                                    <FaFileExcel /> Export Rounds
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Company Rounds Popup */}
                {showRoundDetails && selectedStudent && (
                    <div className="student-rounds-modal">
                        <div className="student-rounds-content">
                            <div className="student-rounds-header">
                                <h2>{selectedStudent.name} - Company Rounds</h2>
                                <button 
                                    className="student-rounds-close"
                                    onClick={() => setShowRoundDetails(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="student-rounds-body">
                                {Object.entries(selectedStudent.rounds).length > 0 ? (
                                    <div className="company-rounds-grid">
                                        {Object.entries(selectedStudent.rounds).map(([companyId, rounds]) => {
                                            const company = companies.find(c => c.id === parseInt(companyId));
                                            if (!company) return null;
                                            return (
                                                <div key={companyId} className="company-round-card">
                                                    <h3 className="company-name">{company.name}</h3>
                                                    <div className="rounds-container">
                                                        {Object.entries(rounds).map(([round, status]) => (
                                                            <div key={round} className="round-item">
                                                                <span className="round-label">{round.replace('round', 'Round ')}</span>
                                                                <span className={`round-status ${status}`}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        <div className="round-item final-status">
                                                            <span className="round-label">Final Status</span>
                                                            <span className={`round-status ${calculateFinalStatus(selectedStudent.rounds, company).toLowerCase()}`}>
                                                                {calculateFinalStatus(selectedStudent.rounds, company)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="no-rounds-message">No company rounds data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageStudents; 