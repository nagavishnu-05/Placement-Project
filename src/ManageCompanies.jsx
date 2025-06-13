import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaBuilding, FaSignOutAlt, FaPlus, FaTimes, FaUsers, FaTrash, FaArrowLeft, FaFileExcel, FaSearch } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Vcet from './assets/VCET Logo.jpg';
import CSE from './assets/CSE LOGO.jpg';
import './styles/ManageCompanies.css';

const ManageCompanies = () => {
    const location = useLocation();
    const batch = location.state?.batch;
    const [showForm, setShowForm] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showStudentPopup, setShowStudentPopup] = useState(false);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        position: '',
        tenth: '',
        twelfth: '',
        cgpa: '',
        historyArrears: '',
        currentArrears: '',
        interviewDate: '',
        rounds: '1'
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Load companies from localStorage when component mounts
    useEffect(() => {
        const savedCompanies = localStorage.getItem('companies');
        if (savedCompanies) {
            setCompanies(JSON.parse(savedCompanies));
        }
    }, []);

    const handleLogout = () => {
        window.location.href = '/';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCompany = {
            id: Date.now(),
            ...formData,
            rounds: parseInt(formData.rounds) || 1  // Convert to number when submitting
        };
        const updatedCompanies = [...companies, newCompany];
        setCompanies(updatedCompanies);
        localStorage.setItem('companies', JSON.stringify(updatedCompanies));
        setShowForm(false);
        setFormData({
            name: '',
            description: '',
            position: '',
            tenth: '',
            twelfth: '',
            cgpa: '',
            historyArrears: '',
            currentArrears: '',
            interviewDate: '',
            rounds: ''  // Reset as string
        });
    };

    const handleDeleteCompany = (companyId) => {
        const updatedCompanies = companies.filter(company => company.id !== companyId);
        setCompanies(updatedCompanies);
        localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        // Set initial students when company is clicked with all rounds as rejected
        const initialStudents = [
            { 
                id: 1, 
                name: "John Doe", 
                rounds: { 
                    [company.id]: Object.fromEntries(
                        Array.from({ length: company.rounds }, (_, i) => [`round${i + 1}`, 'rejected'])
                    )
                } 
            },
            { 
                id: 2, 
                name: "Jane Smith", 
                rounds: { 
                    [company.id]: Object.fromEntries(
                        Array.from({ length: company.rounds }, (_, i) => [`round${i + 1}`, 'rejected'])
                    )
                } 
            },
            { 
                id: 3, 
                name: "Alex Lee", 
                rounds: { 
                    [company.id]: Object.fromEntries(
                        Array.from({ length: company.rounds }, (_, i) => [`round${i + 1}`, 'rejected'])
                    )
                } 
            },
            { 
                id: 4, 
                name: "Sarah Johnson", 
                rounds: { 
                    [company.id]: Object.fromEntries(
                        Array.from({ length: company.rounds }, (_, i) => [`round${i + 1}`, 'rejected'])
                    )
                } 
            },
            { 
                id: 5, 
                name: "Michael Brown", 
                rounds: { 
                    [company.id]: Object.fromEntries(
                        Array.from({ length: company.rounds }, (_, i) => [`round${i + 1}`, 'rejected'])
                    )
                } 
            }
        ];

        // Load existing student data from localStorage
        const savedStudents = localStorage.getItem('studentRounds');
        if (savedStudents) {
            const parsedStudents = JSON.parse(savedStudents);
            initialStudents.forEach(student => {
                if (parsedStudents[student.id] && parsedStudents[student.id][company.id]) {
                    student.rounds[company.id] = parsedStudents[student.id][company.id];
                }
            });
        }

        setStudents(initialStudents);
        setShowStudentPopup(true);
    };

    const handleClosePopup = () => {
        setShowStudentPopup(false);
        setSelectedCompany(null);
    };

    const handleExcelImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Here you would typically process the Excel file
            console.log('File selected:', file.name);
        }
    };

    const calculateFinalStatus = (rounds, totalRounds) => {
        if (!rounds) return 'rejected';
        
        // Get only the rounds that exist for this company
        const statuses = [];
        for (let i = 1; i <= totalRounds; i++) {
            const status = rounds[`round${i}`] || 'rejected';
            statuses.push(status);
        }
        
        // If all rounds are selected, final status is selected
        if (statuses.every(status => status === 'selected')) {
            return 'selected';
        }
        
        // Otherwise, status is rejected
        return 'rejected';
    };

    const handleRoundStatusChange = (studentId, round, currentStatus) => {
        setStudents(prevStudents => {
            const updatedStudents = prevStudents.map(student => {
                if (student.id === studentId) {
                    // Get current rounds for this company
                    const currentRounds = student.rounds[selectedCompany.id] || {};
                    const roundNumber = parseInt(round.replace('round', ''));
                    
                    // Determine next status
                    const statusOrder = ['rejected', 'selected'];
                    const currentIndex = statusOrder.indexOf(currentStatus);
                    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

                    // Create updated rounds object
                    const updatedRounds = { ...currentRounds };

                    // First, update the current round
                    updatedRounds[round] = nextStatus;

                    // If the round is being rejected, reject all subsequent rounds
                    if (nextStatus === 'rejected') {
                        for (let i = roundNumber + 1; i <= selectedCompany.rounds; i++) {
                            updatedRounds[`round${i}`] = 'rejected';
                        }
                    }

                    // If the last round is selected, select all previous rounds
                    if (round === `round${selectedCompany.rounds}` && nextStatus === 'selected') {
                        for (let i = 1; i <= selectedCompany.rounds; i++) {
                            updatedRounds[`round${i}`] = 'selected';
                        }
                    }

                    // Save to localStorage
                    const savedStudents = localStorage.getItem('studentRounds') || '{}';
                    const parsedStudents = JSON.parse(savedStudents);
                    if (!parsedStudents[studentId]) {
                        parsedStudents[studentId] = {};
                    }
                    parsedStudents[studentId][selectedCompany.id] = updatedRounds;
                    localStorage.setItem('studentRounds', JSON.stringify(parsedStudents));

                    return {
                        ...student,
                        rounds: {
                            ...student.rounds,
                            [selectedCompany.id]: updatedRounds
                        }
                    };
                }
                return student;
            });
            return updatedStudents;
        });
    };

    const handleFinalStatusChange = (studentId, companyId, currentStatus) => {
        setStudents(prevStudents => 
            prevStudents.map(student => {
                if (student.id === studentId) {
                    // Get current rounds for this company
                    const currentRounds = student.rounds[companyId] || {};
                    
                    // Determine next status
                    const statusOrder = ['rejected', 'selected'];
                    const currentIndex = statusOrder.indexOf(currentStatus);
                    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

                    // Create updated rounds object
                    const updatedRounds = { ...currentRounds };

                    // Update all rounds based on the final status
                    for (let i = 1; i <= selectedCompany.rounds; i++) {
                        updatedRounds[`round${i}`] = nextStatus;
                    }

                    // Return updated student object
                    return {
                        ...student,
                        rounds: {
                            ...student.rounds,
                            [companyId]: updatedRounds
                        }
                    };
                }
                return student;
            })
        );
    };

    const handleDeleteStudent = (studentId) => {
        setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
    };

    // Filter students based on search query
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-animation p-4 relative overflow-hidden">
            <Head>
                <title>VCET Placement Portal | Manage Companies</title>
                <meta name="description" content="Manage company details and recruitment processes at VCET" />
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
                        <FaBuilding className="admin-nav-icon" />
                        <span className="batch-label">
                            {batch ? `Batch ${batch.startYear}-${batch.endYear}` : 'Loading Batch...'}
                        </span>
                    </div>
                    {!showStudentPopup && (
                    <button 
                        className="admin-nav-button add-company"
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus className="admin-nav-icon" />
                        Add Company
                    </button>
                    )}
                    <Link to="/admin/students" className="admin-nav-button manage-students">
                        <FaUsers className="admin-nav-icon" />
                        Manage Students
                    </Link>
                    <button className="admin-nav-button logout" onClick={handleLogout}>
                        <FaSignOutAlt className="admin-nav-icon" />
                        Logout
                    </button>
                </div>

                {/* Content Area */}
                <div className="admin-dashboard-content">
                    <div className="admin-companies-list">
                        {companies.length === 0 ? (
                            <div className="admin-no-data">
                                <FaBuilding className="admin-excel-icon large" />
                                <h3>No Companies Added</h3>
                                <p>Click "Add Company" to add new companies</p>
                            </div>
                        ) : (
                            <div className="admin-companies-grid">
                                {companies.map(company => (
                                    <div 
                                        key={company.id} 
                                        className="admin-company-card"
                                        onClick={() => handleCompanyClick(company)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="admin-company-header">
                                            <h3 className="admin-company-black">{company.name}</h3>
                                            <button 
                                                className="admin-delete-company-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCompany(company.id);
                                                }}
                                                title="Delete Company"
                                            >
                                                <FaTrash className="admin-delete-icon-white" />
                                            </button>
                                        </div>
                                        <div className="admin-company-details">
                                            <p className="admin-company-black"><strong>Position:</strong> <span>{company.position}</span></p>
                                            <p className="admin-company-black"><strong>Description:</strong> <span>{company.description}</span></p>
                                            <p className="admin-company-black"><strong>Interview Date:</strong> <span>{company.interviewDate}</span></p>
                                            <p className="admin-company-black"><strong>Rounds:</strong> <span>{company.rounds}</span></p>
                                            <div className="admin-company-requirements">
                                                <h4 className="admin-company-black">Requirements</h4>
                                                <p className="admin-company-black">10th: <span>{company.tenth}%</span></p>
                                                <p className="admin-company-black">12th: <span>{company.twelfth}%</span></p>
                                                <p className="admin-company-black">CGPA: <span>{company.cgpa}</span></p>
                                                <p className="admin-company-black">History of Arrears: <span>{company.historyArrears}</span></p>
                                                <p className="admin-company-black">Current Arrears: <span>{company.currentArrears}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Rounds Popup */}
                {showStudentPopup && selectedCompany && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-content">
                            <div className="admin-modal-header">
                                <h2>{selectedCompany.name} - Student Rounds</h2>
                                <button 
                                    className="admin-modal-close"
                                    onClick={handleClosePopup}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="admin-export-container">
                                <div className="admin-search-container">
                                    <FaSearch className="admin-search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="admin-export-actions">
                                    <button 
                                        className="admin-export-excel-button"
                                        onClick={() => {
                                            // Here you would typically export the data to Excel
                                            const exportData = filteredStudents.map((student, index) => {
                                                const rounds = student.rounds[selectedCompany.id] || {};
                                                return {
                                                    'S.No': index + 1,
                                                    'Name': student.name,
                                                    ...Object.fromEntries(
                                                        Object.entries(rounds).map(([round, status]) => [
                                                            round.charAt(0).toUpperCase() + round.slice(1),
                                                            status.charAt(0).toUpperCase() + status.slice(1)
                                                        ])
                                                    ),
                                                    'Final Status': calculateFinalStatus(rounds, selectedCompany.rounds).charAt(0).toUpperCase() + 
                                                                  calculateFinalStatus(rounds, selectedCompany.rounds).slice(1)
                                                };
                                            });
                                            
                                            // Create CSV content
                                            const headers = Object.keys(exportData[0]);
                                            const csvContent = [
                                                headers.join(','),
                                                ...exportData.map(row => 
                                                    headers.map(header => row[header]).join(',')
                                                )
                                            ].join('\n');
                                            
                                            // Create and download file
                                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                            const link = document.createElement('a');
                                            link.href = URL.createObjectURL(blob);
                                            link.download = `${selectedCompany.name}_Student_Status.csv`;
                                            link.click();
                                        }}
                                    >
                                        <FaFileExcel className="admin-excel-icon" />
                                        Export to Excel
                                    </button>
                                    <button 
                                        className="admin-submit-student-button"
                                        onClick={() => {
                                            // Here you would typically save the student round updates
                                            alert('Student round updates saved successfully!');
                                            handleClosePopup();
                                        }}
                                    >
                                        Submit Updates
                                    </button>
                                </div>
                            </div>
                            <div className="admin-students-table-container">
                                <table className="admin-students-table">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Name</th>
                                            {[...Array(selectedCompany.rounds)].map((_, i) => (
                                                <th key={i}>Round {i + 1}</th>
                                            ))}
                                            <th>Final Status</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => {
                                            const rounds = student.rounds[selectedCompany.id] || {};
                                            const finalStatus = calculateFinalStatus(rounds, selectedCompany.rounds);

                                            return (
                                                <tr key={student.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.name}</td>
                                                    {[...Array(selectedCompany.rounds)].map((_, i) => (
                                                        <td
                                                            key={`round-${student.id}-${i + 1}`}
                                                            onClick={() => handleRoundStatusChange(
                                                                student.id,
                                                                `round${i + 1}`,
                                                                rounds[`round${i + 1}`] || 'rejected'
                                                            )}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <span className={`round-status ${rounds[`round${i + 1}`] || 'rejected'}`}>
                                                                {rounds[`round${i + 1}`] || 'rejected'}
                                                            </span>
                                                        </td>
                                                    ))}
                                                    <td
                                                        key={`final-status-${student.id}`}
                                                        onClick={() => handleFinalStatusChange(
                                                            student.id,
                                                            selectedCompany.id,
                                                            finalStatus
                                                        )}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <span className={`round-status ${finalStatus}`}>
                                                            {finalStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="admin-action-btn delete" onClick={() => handleDeleteStudent(student.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Company Form Modal */}
                {showForm && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-content">
                            <div className="admin-modal-header">
                                <h2>Add New Company</h2>
                                <button 
                                    className="admin-modal-close"
                                    onClick={() => setShowForm(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="admin-company-form">
                                <div className="admin-form-section">
                                    <div className="admin-form-group">
                                    <label htmlFor="name">Company Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                            className="admin-form-input"
                                            placeholder="Enter company name"
                                    />
                                </div>

                                    <div className="admin-form-row">
                                        <div className="admin-form-group">
                                        <label htmlFor="description">Description</label>
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                                className="admin-form-input"
                                                placeholder="Enter job description"
                                        />
                                    </div>

                                        <div className="admin-form-group">
                                        <label htmlFor="position">Position Recruiting</label>
                                        <input
                                            type="text"
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            required
                                                className="admin-form-input"
                                                placeholder="Enter position"
                                        />
                                    </div>
                                </div>

                                    <div className="admin-form-section">
                                    <h3>Academic Requirements</h3>
                                        <div className="admin-form-row">
                                            <div className="admin-form-group">
                                            <label htmlFor="tenth">10th Percentage</label>
                                            <input
                                                type="number"
                                                id="tenth"
                                                name="tenth"
                                                value={formData.tenth}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter 10th percentage"
                                            />
                                        </div>

                                            <div className="admin-form-group">
                                            <label htmlFor="twelfth">12th Percentage</label>
                                            <input
                                                type="number"
                                                id="twelfth"
                                                name="twelfth"
                                                value={formData.twelfth}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter 12th percentage"
                                            />
                                        </div>
                                    </div>

                                        <div className="admin-form-row">
                                            <div className="admin-form-group">
                                            <label htmlFor="cgpa">CGPA</label>
                                            <input
                                                type="number"
                                                id="cgpa"
                                                name="cgpa"
                                                value={formData.cgpa}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="10"
                                                step="0.01"
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter CGPA"
                                            />
                                        </div>

                                            <div className="admin-form-group">
                                            <label htmlFor="historyArrears">History of Arrears</label>
                                            <input
                                                type="text"
                                                id="historyArrears"
                                                name="historyArrears"
                                                value={formData.historyArrears}
                                                onChange={handleInputChange}
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter history of arrears"
                                            />
                                        </div>
                                    </div>

                                        <div className="admin-form-row">
                                            <div className="admin-form-group">
                                            <label htmlFor="currentArrears">Current Arrears</label>
                                            <input
                                                type="text"
                                                id="currentArrears"
                                                name="currentArrears"
                                                value={formData.currentArrears}
                                                onChange={handleInputChange}
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter current arrears"
                                            />
                                        </div>

                                            <div className="admin-form-group">
                                            <label htmlFor="interviewDate">Date of Interview</label>
                                            <input
                                                type="date"
                                                id="interviewDate"
                                                name="interviewDate"
                                                value={formData.interviewDate}
                                                onChange={handleInputChange}
                                                required
                                                    className="admin-form-input"
                                            />
                                        </div>
                                    </div>

                                        <div className="admin-form-row">
                                            <div className="admin-form-group">
                                            <label htmlFor="rounds">Number of Rounds</label>
                                            <input
                                                type="number"
                                                id="rounds"
                                                name="rounds"
                                                value={formData.rounds}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="10"
                                                required
                                                    className="admin-form-input"
                                                    placeholder="Enter number of rounds"
                                            />
                                        </div>
                                    </div>
                                </div>

                                    <div className="admin-form-actions">
                                    <button type="submit" className="admin-submit-button">
                                        Add Company
                                    </button>
                                    <button 
                                        type="button" 
                                        className="admin-cancel-button"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCompanies; 