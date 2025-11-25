import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaBriefcase, FaGraduationCap, FaMoneyBillAlt, FaPhoneAlt} from 'react-icons/fa';
import apiClient from '../utils/apiClient';

// Helper function for safe data display
const displayValue = (value) => (value || 'N/A');

// Simple reusable component for displaying a single detail item in the stacked style
const DetailRow = ({ label, value }) => (
    <div className="detail-row-stacked">
        <span className="detail-label-stacked">{label}</span>
        <span className="detail-value-stacked">{value}</span>
    </div>
);

const EmployeeDetailView = ({ onCancel }) => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeId) return;

            setIsLoading(true);
            try {
                const response = await apiClient.get(`/employees/${employeeId}/`);
                setEmployee(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch employee details:", err);
                setError("Failed to load employee details. Please check the ID and network connection.");
                setEmployee(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployee();
    }, [employeeId]);

    // --- Loading, Error, Not Found Renders (Condensed) ---
    if (isLoading) {
        return <div className="page-content-area loading-page">Loading Employee Details...</div>;
    }
    if (error || !employee) {
        return (
            <div className="page-wrapper-classic">
                <header className="page-header-classic">
                    <button type="button" className="btn-back-to-list" onClick={onCancel}>
                        <FaArrowLeft style={{ marginRight: '5px' }} /> Back to List
                    </button>
                    <h2 className="error-text">{error ? "Error Loading Details" : "Employee Not Found"}</h2>
                </header>
                <div style={{ padding: '20px', color: error ? 'red' : 'var(--text-muted)' }}>
                    {error || `The employee with ID "${employeeId}" could not be found.`}
                </div>
            </div>
        );
    }
    // --- End of Error Renders ---

    const fullName = `${displayValue(employee.firstName)} ${displayValue(employee.lastName)}`;
    
    // Use actual data for lists, defaulting to empty array if undefined
    const academicQualifications = employee.academicQualifications || [];
    // PROFESSIONAL EXPERIENCE PART HAS BEEN REMOVED

    // Main Render Block
    return (
        <div className="page-wrapper-classic">
            
            <header className="page-header-classic">
                <button type="button" className="btn-back-to-list" onClick={onCancel}>
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to List
                </button>
                <h1 className="main-title">Employee Profile</h1>
            </header>

            <div className="main-content-classic">
                
                {/* 1. TOP PROFILE BANNER (Matching CV Header Style) */}
                <div className="profile-banner">
                    <div className="profile-image-circle">
                        <FaUser size={50} color="#fff" />
                    </div>
                    <div className="profile-identity">
                        <h2>{fullName}</h2>
                        <p>{displayValue(employee.residentialAddress)}</p>
                        <p>{displayValue(employee.email)}</p>
                    </div>
                </div>

                {/* 2. PERSONAL DETAILS SECTION */}
                <section className="detail-section-classic">
                    <h3 className="section-header-classic">Personal Details</h3>
                    <div className="details-grid-stacked">
                        <DetailRow label="Employee ID" value={displayValue(employee.employeeId)} />
                        <DetailRow label="Date of Birth" value={displayValue(employee.dob)} />
                        <DetailRow label="Sex" value={displayValue(employee.gender)} />
                        <DetailRow label="Marital Status" value={displayValue(employee.maritalStatus)} />
                        <DetailRow label="Nationality" value={displayValue(employee.nationality)} />
                        <DetailRow label="National ID / Passport" value={displayValue(employee.nationalId)} />
                        <DetailRow label="TIN" value={displayValue(employee.tin)} />
                        <DetailRow label="Middle Name" value={displayValue(employee.middleName)} />
                    </div>
                </section>
                
                {/* 3. ACADEMIC & SKILLS SECTION (COMBINED) */}
                <section className="detail-section-classic">
                    <h3 className="section-header-classic"><FaGraduationCap style={{marginRight: '8px'}}/> Education & Skills</h3>
                    <div className="details-grid-stacked">
                         {/* Display primary qualification captured in the main form (for consistency) */}
                        <DetailRow label="Highest Education" value={displayValue(employee.highestEducation)} />
                        <DetailRow label="Graduation Year" value={displayValue(employee.graduationYear)} />
                        <DetailRow label="Institution Name" value={displayValue(employee.institutionName)} />
                        <DetailRow label="Field of Study" value={displayValue(employee.fieldOfStudy)} />
                        
                        <DetailRow label="Languages" value={displayValue(employee.languages)} />
                        <DetailRow label="Skills" value={displayValue(employee.skills)} />
                        <div className="detail-row-stacked form-group--full-width">
                            <span className="detail-label-stacked">Professional Certifications</span>
                            <span className="detail-value-stacked detail-value--wrap">{displayValue(employee.professionalCertifications)}</span>
                        </div>
                        <div className="detail-row-stacked form-group--full-width"></div>
                    </div>

                    {/* Use table only if you expect multiple academic qualifications */}
                    {academicQualifications.length > 0 && (
                        <>
                            <h4 className="sub-header-line-sm" style={{marginTop: '20px'}}>Historical Qualifications List</h4>
                            <table className="data-table-classic">
                                <thead>
                                    <tr>
                                        <th style={{width: '30px'}}>#</th>
                                        <th>Education Level</th>
                                        <th>Institution Name</th>
                                        <th>Programme</th>
                                        <th>Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {academicQualifications.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{displayValue(item.highestEducation)}</td>
                                            <td>{displayValue(item.institutionName)}</td>
                                            <td>{displayValue(item.fieldOfStudy)}</td>
                                            <td>{displayValue(item.graduationYear)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </section>


                {/* PROFESSIONAL EXPERIENCE SECTION HAS BEEN REMOVED HERE */}
                
                 {/* 4. JOB DETAILS SECTION (Separated from Contact) */}
                <section className="detail-section-classic">
                    <h3 className="section-header-classic"><FaBriefcase style={{marginRight: '8px'}}/> Employment & Contract</h3>
                    <div className="details-grid-stacked">
                        <DetailRow label="Job Title" value={displayValue(employee.jobTitle)} />
                        <DetailRow label="Department" value={displayValue(employee.department)} />
                        <DetailRow label="Division" value={displayValue(employee.division)} />
                        <DetailRow label="Grade / Level" value={displayValue(employee.grade)} />
                        <DetailRow label="Employment Type" value={displayValue(employee.employmentType)} />
                        <DetailRow label="Employment Status" value={displayValue(employee.employmentStatus)} />
                        <DetailRow label="Date of Hire" value={displayValue(employee.dateOfHire)} />
                        <DetailRow label="Work Location" value={displayValue(employee.workLocation)} />
                        <DetailRow label="Supervisor" value={displayValue(employee.supervisor)} />
                        <DetailRow label="Contract Start Date" value={displayValue(employee.contractStartDate)} />
                        <DetailRow label="Contract End Date" value={displayValue(employee.contractEndDate)} />
                        <DetailRow label="N/A" value="N/A" />
                    </div>
                </section>

                {/* 5. SALARY & FINANCE DETAILS (NEW SECTION) */}
                <section className="detail-section-classic">
                    <h3 className="section-header-classic"><FaMoneyBillAlt style={{marginRight: '8px'}}/> Salary & Finance</h3>
                    <div className="details-grid-stacked">
                        <DetailRow label="Basic Salary" value={`${displayValue(employee.currency)} ${displayValue(employee.basicSalary)}`} />
                        <DetailRow label="Allowances" value={`${displayValue(employee.currency)} ${displayValue(employee.allowances)}`} />
                        <DetailRow label="Deductions" value={`${displayValue(employee.currency)} ${displayValue(employee.deductions)}`} />
                        <DetailRow label="Currency" value={displayValue(employee.currency)} />
                        <DetailRow label="Bank Name" value={displayValue(employee.bankName)} />
                        <DetailRow label="Account Number" value={displayValue(employee.bankAccountNumber)} />
                        <DetailRow label="Payment Method" value={displayValue(employee.paymentMethod)} />
                        <DetailRow label="N/A" value="N/A" />
                        <DetailRow label="NSSF / Pension No." value={displayValue(employee.nssfNumber)} />
                        <DetailRow label="NHIF / Health No." value={displayValue(employee.nhifNumber)} />
                    </div>
                </section>
                
                 {/* 6. CONTACT & EMERGENCY DETAILS (NEW SECTION) */}
                <section className="detail-section-classic">
                    <h3 className="section-header-classic"><FaPhoneAlt style={{marginRight: '8px'}}/> Contact & Emergency</h3>
                    <div className="details-grid-stacked">
                        <DetailRow label="Phone Number" value={displayValue(employee.phoneNumber)} />
                        <DetailRow label="Email Address" value={displayValue(employee.email)} />
                        <DetailRow label="Residential Address" value={displayValue(employee.residentialAddress)} />
                        <DetailRow label="Postal Address" value={displayValue(employee.postalAddress)} />
                        <h4 className="sub-header-line-sm form-group--full-width">Emergency Contact Details</h4>
                        <DetailRow label="Contact Name" value={displayValue(employee.emergencyContactName)} />
                        <DetailRow label="Contact Phone" value={displayValue(employee.emergencyContactPhone)} />
                        <DetailRow label="Relationship" value={displayValue(employee.emergencyRelationship)} />
                        <DetailRow label="N/A" value="N/A" />
                    </div>
                </section>

            </div>
            
            <footer className="page-footer-classic">
                <p>&copy; {new Date().getFullYear()} Management System. Employee Record ID: {displayValue(employee.employeeId)}</p>
                <p>Generated on {new Date().toLocaleDateString()}</p>
            </footer>

            <style jsx>{`
                .page-wrapper-classic {
                    padding: 0;
                    background-color: white;
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                }
                .page-header-classic {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 40px;
                    border-bottom: 1px solid #ddd;
                    background-color: var(--page-background, #f8f8f8);
                }
                .main-content-classic {
                    max-width: 1900px; /* Adjusted to 1000px for better layout on a page */
                    margin: 30px auto;
                    padding: 0 20px;
                }
                .main-title {
                    font-size: 1.5rem;
                    color: var(--text-color-strong, #333);
                    margin: 0;
                }
                
                /* Back Button Styles (Kept the good style) */
                .btn-back-to-list {
                    background-color: white; 
                    color: var(--primary-color, #3498db); 
                    border: 1px solid var(--primary-color, #3498db);
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .btn-back-to-list:hover {
                    background-color: var(--primary-color, #3498db);
                    color: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                /* --- FOOTER STYLES --- */
                .page-footer-classic {
                    max-width: 1000px;
                    margin: 40px auto 20px;
                    padding: 20px 20px 10px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    font-size: 0.85rem;
                    color: var(--text-muted, #777);
                }
                .page-footer-classic p {
                    margin: 5px 0;
                }

                /* --- PROFILE BANNER (TOP SECTION) --- */
                .profile-banner {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    background-color: var(--page-background, #f8f8f8);
                    border: 1px solid #eee;
                    border-radius: 4px;
                    margin-bottom: 30px;
                }
                .profile-image-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-color: var(--primary-color, #3498db);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 20px;
                    flex-shrink: 0;
                }
                .profile-identity h2 {
                    margin: 0 0 5px;
                    font-size: 1.6rem;
                    color: var(--text-color-strong);
                }
                .profile-identity p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--text-muted, #777);
                }

                /* --- STACKED SECTIONS --- */
                .detail-section-classic {
                    margin-bottom: 40px;
                }
                .section-header-classic {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: var(--text-color-strong, #333);
                    padding-bottom: 5px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    align-items: center;
                }
                .sub-header-line-sm {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--primary-color, #3498db);
                    margin: 10px 0;
                    padding-top: 5px;
                    border-top: 1px solid #eee;
                }
                .details-grid-stacked {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px 30px;
                }
                
                /* Single Detail Row Style */
                .detail-row-stacked {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px dotted #ccc;
                    padding: 8px 0;
                }
                .detail-label-stacked {
                    font-weight: 500;
                    color: var(--text-color, #333);
                    flex-shrink: 0;
                    padding-right: 15px;
                }
                .detail-value-stacked {
                    font-weight: 400;
                    color: var(--text-color-strong, #333);
                    text-align: right;
                    /* Allows certifications/skills text to wrap */
                    white-space: normal; 
                    word-break: break-word;
                }
                .detail-value--wrap {
                    max-width: 60%; 
                }

                /* Table Styles (For Qualifications/Experience) */
                .data-table-classic {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                    margin-top: 15px;
                }
                .data-table-classic th,
                .data-table-classic td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                .data-table-classic th {
                    background-color: var(--table-header-bg, #f2f2f2);
                    font-weight: 600;
                    color: var(--text-color-strong);
                }
                /* Full width grid items to fix layout issues */
                .form-group--full-width {
                    grid-column: 1 / -1; 
                }
            `}</style>
        </div>
    );
};

export default EmployeeDetailView;