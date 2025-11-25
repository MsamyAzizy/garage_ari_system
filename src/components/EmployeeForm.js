// src/components/EmployeeForm.js (FINAL FRONTEND CODE WITH VALIDATION FIXES)

import React, { useState, useCallback } from 'react';
//import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient'; // Import the configured API client
import {
    FaUser, FaHome, FaBriefcase, FaMoneyBillAlt, FaGraduationCap,
    FaSave, FaTimes, FaArrowLeft
} from 'react-icons/fa';

// ----------------------------------------------------------------------
// 1. DATA DEFINITIONS & NATIONALITY LIST (Unchanged)
// ----------------------------------------------------------------------
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const EMPLOYMENT_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EMPLOYMENT_STATUS_OPTIONS = ['Active', 'On Leave', 'Suspended', 'Terminated'];
const CURRENCY_OPTIONS = ['USD', 'EUR', 'TZS', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'];
const PAYMENT_METHOD_OPTIONS = [
    'Bank Transfer', 
    'Cash', 
    'Cheque', 
    'Mobile Money',
    'M-PESA', 
    'MIXX BY YAS', 
    'AIRTEL MONEY', 
    'HALOPESA', 
    'TTCL'
];
const EDUCATION_LEVELS = ['High School', 'Certificate', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'];
const NATIONALITY_OPTIONS = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan and Barbudan',
    'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini',
    'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese',
    'Bolivian', 'Bosnian and Herzegovinian', 'Botswanan', 'Brazilian', 'British', 'Bruneian',
    'Bulgarian', 'Burkinabe', 'Burundian', 'Cabo Verdean', 'Cambodian', 'Cameroonian', 'Canadian',
    'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comorian', 'Congolese (Congo-Brazzaville)',
    'Congolese (Congo-Kinshasa)', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish',
    'Djiboutian', 'Dominican (Commonwealth)', 'Dominican (Republic)', 'Dutch', 'East Timorese', 'Ecuadorean',
    'Egyptian', 'Salvadoran', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Eswatini', 'Ethiopian',
    'Fijian', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek',
    'Grenadian', 'Guatemalan', 'Guinean', 'Guinea-Bissauan', 'Guyanese', 'Haitian', 'Honduran',
    'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian',
    'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittitian and Nevisian',
    'Kosovan', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Lesotho', 'Liberian', 'Libyan',
    'Liechtensteiner', 'Lithuanian', 'Luxembourgish', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian',
    'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan',
    'Monégasque', 'Mongolian', 'Montenegrin', 'Moroccan', 'Mozambican', 'Myanmarese', 'Namibian',
    'Nauruan', 'Nepali', 'New Zealander', 'Nicaraguan', 'Nigerien', 'Nigerian', 'North Korean',
    'North Macedonian', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Palestinian', 'Panamanian',
    'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Philippine', 'Polish', 'Portuguese', 'Qatari',
    'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Samoan', 'San Marinese', 'São Toméan', 'Saudi Arabian',
    'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian',
    'Solomon Islander', 'Somali', 'South African', 'South Korean', 'South Sudanese', 'Spanish',
    'Sri Lankan', 'Sudanese', 'Surinamese', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik',
    'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian and Tobagonian', 'Tunisian', 'Turkish',
    'Turkmen', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Emirati', 'Uruguayan', 'Uzbek', 'Vanuatuan',
    'Venezuelan', 'Vietnamese', 'Yemeni', 'Zambian', 'Zimbabwean'
].sort();
const JOB_TITLE_OPTIONS = [
    'System Administrator',
    'Workshop / Garage Manager',
    'Service Advisor',
    'Mechanic / Technician',
    'Spare Parts / Inventory Officer',
    'Cashier / Accounts Officer',
    'Receptionist / Front Desk Officer',
    'Customer Relations / Marketing Officer',
    'Quality Control Inspector',
    'Fleet Manager',
    'Auto Electrician Specialist',
    'Procurement Officer',
    'IT Support / System Developer',
].sort();
const DEPARTMENT_OPTIONS = [
    'Administration',
    'Workshop / Service',
    'Customer Service',
    'Spare Parts / Inventory',
    'Finance & Accounts',
    'Sales & Marketing',
    'Human Resources (HR)',
    'IT & System Support',
    'Quality Control',
    'Procurement',
    'Fleet Management'
].sort();
const DIVISION_OPTIONS = [
    'Mechanical Division',
    'Electrical & Diagnostics Division',
    'Body & Paint Division',
    'Spare Parts & Accessories Division',
    'Customer Support & Front Desk Division',
    'Accounts & Billing Division',
    'Human Resource & Payroll Division',
    'IT & Data Management Division',
    'Procurement & Supplier Division',
    'Quality Assurance Division',
    'Fleet Maintenance Division',
    'Sales & Marketing Division'
].sort();
const GRADE_OPTIONS = [
    '1. Executive Management',
    '2. Senior Management',
    '3. Department Head / Supervisor Level',
    '4. Senior Technician / Specialist Level',
    '5. Technician / Officer Level',
    '6. Assistant / Junior Level',
    '7. Support Staff Level',
    '8. Trainee / Intern Level'
];
const BANK_OPTIONS = [
    'Absa Bank (Tanzania) Ltd',
    'Access Bank (Tanzania) Ltd',
    'Akiba Commercial Bank Plc',
    'Amana Bank Ltd',
    'Azania Bank Plc',
    'Bank of Africa (Tanzania) Ltd',
    'Bank of Baroda (Tanzania) Ltd',
    'Bank of India (Tanzania) Ltd',
    'Canara Bank (Tanzania) Ltd',
    'China Dasheng Bank Ltd',
    'Citibank (Tanzania) Ltd',
    'CRDB Bank Plc',
    'DCB Commercial Bank Plc',
    'Diamond Trust Bank (Tanzania) Plc',
    'Ecobank (Tanzania) Ltd',
    'Equity Bank (Tanzania) Ltd',
    'Exim Bank (Tanzania) Ltd',
    'Guaranty Trust Bank (Tanzania) Ltd',
    'Habib African Bank Ltd',
    'I&M Bank (Tanzania) Ltd',
    'International Commercial Bank (Tanzania) Ltd',
    'KCB Bank (Tanzania) Ltd',
    'Letshego Bank (T) Ltd',
    'Mkombozi Commercial Bank Plc',
    'Mwalimu Commercial Bank Plc',
    'National Bank of Commerce Ltd',
    'NCBA Bank (Tanzania) Ltd',
    'NMB Bank Plc',
    'People’s Bank of Zanzibar Ltd',
    'Stanbic Bank (Tanzania) Ltd',
    'Standard Chartered Bank (Tanzania) Ltd',
    'Tanzania Commercial Bank Plc',
    'United Bank for Africa (Tanzania) Ltd',
].sort();


// --- Mock ID Generator Function ---
const generateEmployeeId = () => {
    const mockId = 1000 + Math.floor(Math.random() * 900) + 1;
    return `EMP-${mockId}`;
};

const EmployeeForm = ({ onSave, onCancel, employeeData }) => {
    const isEditMode = !!employeeData?.id;
    
    const initialEmployeeId = isEditMode 
        ? employeeData.employeeId 
        : (employeeData?.employeeId || generateEmployeeId()); 

    const [formData, setFormData] = useState(employeeData ? employeeData : {
        employeeId: initialEmployeeId,
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: '',
        nationality: '', 
        maritalStatus: '',
        nationalId: '',
        tin: '',
        phoneNumber: '',
        email: '',
        residentialAddress: '',
        postalAddress: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyRelationship: '',
        jobTitle: '',
        department: '',
        division: '',
        employmentType: 'Full-time',
        employmentStatus: 'Active',
        dateOfHire: '',
        contractStartDate: '',
        contractEndDate: '',
        supervisor: '',
        workLocation: '',
        grade: '', 
        basicSalary: '',
        allowances: '',
        deductions: '',
        bankName: '',
        bankAccountNumber: '',
        paymentMethod: 'Bank Transfer',
        currency: 'USD',
        nssfNumber: '',
        nhifNumber: '',
        highestEducation: '',
        institutionName: '',
        fieldOfStudy: '',
        graduationYear: '',
        professionalCertifications: '',
        skills: '',
        languages: '',
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // 🏆 CRITICAL FIX: REAL API SUBMISSION HANDLER - Data Cleansing & Error Handling Added
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- PRE-PROCESSING THE DATA FOR BACKEND VALIDATION ---
        const dataToSend = { ...formData };
        
        // List of fields that must send null (not "") if left blank, as per the serializer setup
        // This resolves 'Date has wrong format' and 'A valid integer is required' errors for optional fields.
        const optionalNullFields = [
            'dob', 'contractStartDate', 'contractEndDate', 
            'graduationYear', 'basicSalary', 'allowances', 'deductions'
        ];

        optionalNullFields.forEach(field => {
            const value = dataToSend[field];
            // If the value is an empty string, set it to JSON null
            if (value === '' || value === undefined) {
                dataToSend[field] = null;
            }
        });
        // --------------------------------------------------------

        // 1. Determine API method and URL
        const method = isEditMode ? 'put' : 'post';
        const url = isEditMode 
            ? `/employees/${employeeData.id}/` 
            : '/employees/'; 

        try {
            // 2. Perform the API call using the cleaned dataToSend
            const response = await apiClient({
                method: method,
                url: url,
                data: dataToSend, // <--- Use dataToSend here
            });

            // 3. Success Handling
            if (onSave) {
                onSave(response.data, !isEditMode); 
            } else {
                 console.log("Employee saved successfully but onSave prop is missing.");
            }

        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} employee:`, error);
            
            const errorData = error.response?.data;
            let errorMsg = 'Please check API connection.';
            
            if (errorData) {
                // Corrected error formatting (FIXES: errorData[key].join is not a function)
                errorMsg = Object.keys(errorData)
                    .map(key => {
                        const errorValue = errorData[key];
                        if (Array.isArray(errorValue)) {
                            // If it's an array of errors (the usual case), join them
                            return `${key}: ${errorValue.join(' ')}`;
                        } else if (typeof errorValue === 'string') {
                            // If it's a simple string error, use it directly
                            return `${key}: ${errorValue}`;
                        } else {
                            // Handle general object/non-string errors
                            return `${key}: ${JSON.stringify(errorValue)}`;
                        }
                    })
                    .join('\n');
            }

            alert(`Error saving employee:\n${errorMsg}`);
        }
    };

    return (
        <div className="form-page-container">
            {/* 🏆 UPDATED HEADER: Added Back button here for top-right positioning */}
            <header className="page-header">
                <h2>{isEditMode ? 'Edit Employee Profile' : 'New Employee Registration'}</h2>
                <button 
                    type="button" 
                    className="btn-back-to-list" 
                    onClick={onCancel} // Use onCancel to navigate back to the list
                >
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to List
                </button>
            </header>
            {/* ----------------------------------------------------------------- */}

            <form onSubmit={handleSubmit} className="app-form">

                {/* ----------------------------------------------------------------- */}
                {/* 1. BASIC INFORMATION */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaUser /> Basic Information</h3>
                    <div className="form-grid">

                        <div className="form-group">
                            <label htmlFor="employeeId">Employee ID *</label>
                            <input 
                                type="text" 
                                id="employeeId" 
                                name="employeeId" 
                                value={formData.employeeId} 
                                onChange={handleChange} 
                                required 
                                disabled 
                                readOnly
                                className="disabled-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName">Middle Name</label>
                            <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            {/* NOTE: type="date" handles YYYY-MM-DD format, but the value must be "" or a valid date string */}
                            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nationality">Nationality</label>
                            <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange}>
                                <option value="">Select Nationality</option>
                                {NATIONALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="maritalStatus">Marital Status</label>
                            <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                <option value="">Select Status</option>
                                {MARITAL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="nationalId">National ID / Passport Number</label>
                            <input type="text" id="nationalId" name="nationalId" value={formData.nationalId} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tin">Tax Identification Number (TIN)</label>
                            <input type="text" id="tin" name="tin" value={formData.tin} onChange={handleChange} />
                        </div>
                        <div className="form-group"></div>
                        <div className="form-group"></div>

                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 2. CONTACT DETAILS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaHome /> Contact Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="residentialAddress">Residential Address</label>
                            <input type="text" id="residentialAddress" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} />
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="postalAddress">Postal Address</label>
                            <input type="text" id="postalAddress" name="postalAddress" value={formData.postalAddress} onChange={handleChange} />
                        </div>

                        <h4 className="sub-header-line form-group--full-width">Emergency Contact</h4>

                        <div className="form-group">
                            <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                            <input type="text" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                            <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emergencyRelationship">Relationship</label>
                            <input type="text" id="emergencyRelationship" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} />
                        </div>
                        <div className="form-group"></div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 3. JOB DETAILS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaBriefcase /> Job Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="jobTitle">Job Title / Position *</label>
                            <select id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required>
                                <option value="">Select Job Title</option>
                                {JOB_TITLE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select id="department" name="department" value={formData.department} onChange={handleChange}>
                                <option value="">Select Department</option>
                                {DEPARTMENT_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="division">Division / Section</label>
                            <select id="division" name="division" value={formData.division} onChange={handleChange}>
                                <option value="">Select Division/Section</option>
                                {DIVISION_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="grade">Grade / Level / Rank</label>
                            <select id="grade" name="grade" value={formData.grade} onChange={handleChange}>
                                <option value="">Select Rank</option>
                                {GRADE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="employmentType">Employment Type *</label>
                            <select id="employmentType" name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                                {EMPLOYMENT_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="employmentStatus">Employment Status *</label>
                            <select id="employmentStatus" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required>
                                {EMPLOYMENT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfHire">Date of Hire / Joining Date *</label>
                            <input type="date" id="dateOfHire" name="dateOfHire" value={formData.dateOfHire} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="workLocation">Work Location / Branch</label>
                            <input type="text" id="workLocation" name="workLocation" value={formData.workLocation} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contractStartDate">Contract Start Date</label>
                            <input type="date" id="contractStartDate" name="contractStartDate" value={formData.contractStartDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contractEndDate">Contract End Date</label>
                            <input type="date" id="contractEndDate" name="contractEndDate" value={formData.contractEndDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="supervisor">Supervisor / Manager Name or ID</label>
                            <input type="text" id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} />
                        </div>
                        <div className="form-group"></div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 4. SALARY & FINANCE */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaMoneyBillAlt /> Salary & Finance</h3>
                    <div className="form-grid">

                        <div className="form-group">
                            <label htmlFor="basicSalary">Basic Salary</label>
                            <input type="number" id="basicSalary" name="basicSalary" value={formData.basicSalary} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="allowances">Allowances</label>
                            <input type="number" id="allowances" name="allowances" value={formData.allowances} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deductions">Deductions</label>
                            <input type="number" id="deductions" name="deductions" value={formData.deductions} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currency">Currency</label>
                            <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
                                {CURRENCY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bankName">Bank Name</label>
                            <select id="bankName" name="bankName" value={formData.bankName} onChange={handleChange}>
                                <option value="">Select Bank</option>
                                {BANK_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bankAccountNumber">Bank Account Number</label>
                            <input type="text" id="bankAccountNumber" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentMethod">Payment Method</label>
                            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                                {PAYMENT_METHOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group"></div>

                        <div className="form-group">
                            <label htmlFor="nssfNumber">NSSF / Pension Number</label>
                            <input type="text" id="nssfNumber" name="nssfNumber" value={formData.nssfNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nhifNumber">NHIF / Health Insurance Number</label>
                            <input type="text" id="nhifNumber" name="nhifNumber" value={formData.nhifNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group"></div>
                        <div className="form-group"></div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 5. EDUCATION & SKILLS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaGraduationCap /> Education & Skills</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="highestEducation">Highest Education Level</label>
                            <select id="highestEducation" name="highestEducation" value={formData.highestEducation} onChange={handleChange}>
                                <option value="">Select Level</option>
                                {EDUCATION_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="institutionName">Institution Name</label>
                            <input type="text" id="institutionName" name="institutionName" value={formData.institutionName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fieldOfStudy">Field of Study</label>
                            <input type="text" id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="graduationYear">Graduation Year</label>
                            <input type="number" id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="YYYY" />
                        </div>

                        <div className="form-group form-group--full-width">
                            <label htmlFor="professionalCertifications">Professional Certifications</label>
                            <textarea id="professionalCertifications" name="professionalCertifications" rows="2" value={formData.professionalCertifications} onChange={handleChange} placeholder="List certifications, separated by commas..."></textarea>
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="skills">Skills / Competencies</label>
                            <textarea id="skills" name="skills" rows="2" value={formData.skills} onChange={handleChange} placeholder="List technical and soft skills..."></textarea>
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="languages">Languages Known</label>
                            <input type="text" id="languages" name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g., English, Swahili, French" />
                        </div>

                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 6. FORM ACTIONS (UNCHANGED) */}
                {/* ----------------------------------------------------------------- */}
                <div className="page-form-actions">
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '5px' }} /> {isEditMode ? 'Update Employee' : 'Save Employee'}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .form-page-container {
                    background-color: #f7f9fc;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    max-width: 1900px;
                    margin: 20px auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .page-header h2 {
                    margin: 0;
                    color: #333;
                }
                .btn-back-to-list {
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.2s;
                }
                .btn-back-to-list:hover {
                    background-color: #5a6268;
                }
                .app-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-section {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .section-header {
                    color: #007bff;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sub-header-line {
                    color: #555;
                    font-size: 1.1em;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    border-bottom: 1px dashed #ddd;
                    padding-bottom: 5px;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .form-group--full-width {
                    grid-column: 1 / -1;
                }
                .form-group label {
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #555;
                }
                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                    width: 100%;
                    box-sizing: border-box; /* Crucial for full-width inputs */
                }
                .disabled-input {
                    background-color: #e9ecef;
                    color: #6c757d;
                    cursor: not-allowed;
                }
                .page-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 20px;
                }
                .btn-primary-action, .btn-secondary {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                }
                .btn-primary-action {
                    background-color: #28a745;
                    color: white;
                }
                .btn-primary-action:hover {
                    background-color: #218838;
                }
                .btn-secondary {
                    background-color: #f0ad4e;
                    color: white;
                }
                .btn-secondary:hover {
                    background-color: #ec971f;
                }
            `}</style>
        </div>
    );
};

export default EmployeeForm;