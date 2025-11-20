import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaSave, FaUserEdit, FaKey, FaCamera, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth(); // Get user and updater from context
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Ref for hidden file input

    // --- State for User Details Form ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [detailsSuccess, setDetailsSuccess] = useState('');

    // --- State for Password Update Form ---
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    
    // ⭐ NEW STATE: for Avatar Update
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState('');
    const [avatarSuccess, setAvatarSuccess] = useState('');

    // Load initial user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // --- HANDLER: Update User Details (Name/Email) ---
    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setDetailsError('');
        setDetailsSuccess('');
        setIsSavingDetails(true);

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
            };
            
            const response = await apiClient.patch('/auth/users/me/', payload); 
            
            updateUser(response.data); 
            
            setFirstName(response.data.first_name || ''); 
            setLastName(response.data.last_name || '');

            setDetailsError(''); 
            setDetailsSuccess('Profile details updated successfully!');
            

        } catch (error) {
            console.error("Profile update failed:", error.response?.data || error.message);
            setDetailsError('Failed to update details. Please try again.');
            setDetailsSuccess('');
        } finally {
            setIsSavingDetails(false);
        }
    };

    // ⭐ NEW HANDLER: Avatar Upload
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarError('');
        setAvatarSuccess('');
        setIsUploadingAvatar(true);

        const uploadEndpoint = `/auth/users/me/`; 

        const formData = new FormData();
        // The field name 'avatar' MUST match the model field name
        formData.append('avatar', file); 
        
        try {
            const response = await apiClient.patch(uploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // ⭐ CRITICAL DEBUG STEP: Check this console output for the full URL!
            console.log('--- AVATAR UPLOAD RESPONSE ---');
            console.log('User object received from backend:', response.data);
            console.log('--- END AVATAR UPLOAD RESPONSE ---');

            // Success actions
            updateUser(response.data); // Updates context state with the new 'avatar' URL
            setAvatarSuccess('Profile picture updated successfully!');
            setAvatarError('');

        } catch (error) {
            console.error("Avatar upload failed:", error.response?.data || error.message);
            let errorMsg = 'Failed to upload image. Max size 2MB, formats: jpg, png.';
            if (error.response?.data?.avatar) {
                 errorMsg = `Upload Error: ${error.response.data.avatar.join(' ')}`;
            } else if (error.response?.data?.detail) {
                 errorMsg = `Error: ${error.response.data.detail}`;
            }
            
            setAvatarError(errorMsg);
            setAvatarSuccess('');
        } finally {
            setIsUploadingAvatar(false);
            e.target.value = null; 
        }
    };
    
    // ⭐ NEW HANDLER: Remove Avatar
    const handleRemoveAvatar = async () => {
        // 🚨 FIX 1: Use user.avatar which is the field returned by the serializer
        if (!user.avatar) return; 

        if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

        setAvatarError('');
        setAvatarSuccess('');
        setIsUploadingAvatar(true); 

        try {
            // PATCH the user model with avatar set to null to clear it
            const response = await apiClient.patch(`/auth/users/me/`, { avatar: null });

            // Update Auth context with the null avatar field
            updateUser(response.data); 

            setAvatarSuccess('Profile picture successfully removed.');
            setAvatarError('');

        } catch (error) {
            console.error("Avatar removal failed:", error.response?.data || error.message);
            setAvatarError('Failed to remove profile picture.');
            setAvatarSuccess('');
        } finally {
            setIsUploadingAvatar(false);
        }
    };


    // --- HANDLER: Update Password ---
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setIsSavingPassword(true);

        if (newPassword !== newPassword2) {
            setPasswordError('New password and confirmation do not match.');
            setIsSavingPassword(false);
            return;
        }

        try {
            const payload = {
                current_password: oldPassword, 
                new_password: newPassword,
                re_new_password: newPassword2,
            };
            
            await apiClient.post('/auth/users/set_password/', payload); 
            
            setPasswordError('');
            setPasswordSuccess('Password updated successfully! You will be logged out to re-login.');
            
            setOldPassword('');
            setNewPassword('');
            setNewPassword2('');

            setTimeout(async () => {
                await logout();
                navigate('/login'); 
            }, 2000);

        } catch (error) {
            console.error("Password change failed:", error.response?.data || error.message);
            
            let errorMsg = 'Failed to update password. Check old password.';
            if (error.response?.data?.current_password) {
                 errorMsg = `Current Password Error: ${error.response.data.current_password.join(' ')}`;
            } else if (error.response?.data?.new_password) {
                 errorMsg = `New Password Error: ${error.response.data.new_password.join(' ')}`;
            } else if (error.response?.data?.non_field_errors) {
                 errorMsg = `Error: ${error.response.data.non_field_errors.join(' ')}`;
            }
            
            setPasswordError(errorMsg);
            setPasswordSuccess(''); 
        } finally {
            setIsSavingPassword(false);
        }
    };

    // 🚨 FIX 2: Use user.avatar to get the image URL from the context
    const currentAvatarUrl = user?.avatar || 'https://i.pravatar.cc/150?u=placeholder';
    
    if (!user) {
        return <div className="loading-state">Loading user profile...</div>;
    }
    
    // -----------------------------------------------------------------
    // RENDER
    // -----------------------------------------------------------------
    return (
        <div className="list-page-container profile-page-container">
            <header className="page-header">
                <h2><FaUserEdit style={{ marginRight: '8px' }} /> My Account Profile</h2>
            </header>
            
            <div className="profile-content-grid">
                
                {/* ⭐ AVATAR UPDATE CARD (Column 1) */}
                <div className="form-card avatar-card">
                    <h3>Profile Picture</h3>
                    
                    <div className="avatar-preview-area">
                        {/* Display Current Avatar */}
                        <img 
                            src={currentAvatarUrl} 
                            alt={`${user.first_name}'s avatar`} 
                            className="current-avatar"
                        />
                        
                        {/* Status Message */}
                        {avatarError && <p className="status-message error small">{avatarError}</p>}
                        {avatarSuccess && <p className="status-message success small">{avatarSuccess}</p>}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            style={{ display: 'none' }} // Hide default input
                            disabled={isUploadingAvatar}
                        />

                        {isUploadingAvatar ? (
                            <button className="btn-upload" disabled>
                                <FaSpinner className="spin" /> Uploading...
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn-upload" 
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaCamera style={{ marginRight: '5px' }} /> Upload New Photo
                            </button>
                        )}

                        {/* This check is correct now, referencing user.avatar */}
                        {user.avatar && (
                             <button 
                                type="button" 
                                className="btn-remove" 
                                onClick={handleRemoveAvatar}
                                disabled={isUploadingAvatar}
                            >
                                <FaTimesCircle style={{ marginRight: '5px' }} /> Remove Photo
                            </button>
                        )}
                       
                    </div>
                </div>
                
                {/* --- 1. DETAILS UPDATE FORM (Column 2, spans 2/3) --- */}
                <div className="form-card details-card details-span">
                    <h3>Personal Details</h3>
                    <form onSubmit={handleUpdateDetails}>
                        
                        {/* Status Message */}
                        {detailsError && <p className="status-message error">{detailsError}</p>}
                        {detailsSuccess && <p className="status-message success">{detailsSuccess}</p>}
                        
                        {/* First Name */}
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Last Name */}
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Email (Read-only) */}
                        <div className="input-group read-only-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                readOnly
                                disabled
                            />
                        </div>

                        <button type="submit" className="btn-save" disabled={isSavingDetails}>
                            <FaSave style={{ marginRight: '5px' }} /> 
                            {isSavingDetails ? 'Saving...' : 'Update Details'}
                        </button>
                    </form>
                </div>

                {/* --- 2. PASSWORD UPDATE FORM (Column 3) --- */}
                <div className="form-card password-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handleUpdatePassword}>
                        
                        {/* Status Message */}
                        {passwordError && <p className="status-message error">{passwordError}</p>}
                        {passwordSuccess && <p className="status-message success">{passwordSuccess}</p>}

                        {/* Old Password */}
                        <div className="input-group">
                            <FaKey className="input-icon" />
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <span 
                                className="password-toggle-icon" 
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        {/* Confirm New Password */}
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                value={newPassword2}
                                onChange={(e) => setNewPassword2(e.target.value)}
                                required
                            />
                        </div>
                        

                        <button type="submit" className="btn-save" disabled={isSavingPassword}>
                            <FaSave style={{ marginRight: '5px' }} /> 
                            {isSavingPassword ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>

            {/* --- Internal Styles for Profile Page Layout --- */}
            <style jsx>{`
                .profile-page-container {
                    background-color: var(--bg-page-light);
                    padding: 20px;
                }
                /* UPDATED GRID LAYOUT: 3 columns for avatar, details, and password */
                .profile-content-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1.5fr; /* e.g., 20% | 40% | 30% */
                    gap: 30px;
                    margin-top: 20px;
                }
                
                /* Responsive adjustment for smaller screens */
                @media (max-width: 1024px) {
                    .profile-content-grid {
                        grid-template-columns: 1fr 1fr; /* Two columns */
                    }
                    .details-span {
                        grid-column: span 2; /* Details span both columns */
                    }
                }
                @media (max-width: 768px) {
                     .profile-content-grid {
                        grid-template-columns: 1fr; /* Single column stack */
                    }
                    .details-span {
                        grid-column: auto;
                    }
                }

                .form-card {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border-top: 5px solid #5d9cec;
                }
                .form-card h3 {
                    margin-top: 0;
                    color: #2c3848;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                
                /* ⭐ AVATAR CARD SPECIFIC STYLES ⭐ */
                .avatar-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    border-top: 5px solid #2ecc71; /* Green border for distinct color */
                }
                .avatar-preview-area {
                    width: 100%;
                }
                .current-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #f0f0f0;
                    margin-bottom: 20px;
                }
                .btn-upload {
                    width: 100%;
                    padding: 10px;
                    background-color: #2ecc71; /* Success color */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 10px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-upload:hover {
                    background-color: #27ae60;
                }
                .btn-remove {
                    width: 100%;
                    padding: 10px;
                    background-color: #e74c3c; /* Error color */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 10px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-remove:hover {
                    background-color: #c0392b;
                }
                .btn-upload:disabled, .btn-remove:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .status-message.small {
                    font-size: 12px;
                    margin-top: 10px;
                    margin-bottom: 0;
                }
                
                /* --- GENERAL FORM STYLES (Existing) --- */
                .input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 8px;
                    transition: border-color 0.2s;
                }
                .input-group:focus-within {
                    border-color: #5d9cec;
                }
                .input-icon, .password-toggle-icon {
                    color: #5d9cec;
                    font-size: 16px;
                    margin-right: 10px;
                }
                .password-toggle-icon {
                    cursor: pointer;
                    margin-right: 0;
                    margin-left: 10px;
                    color: #888;
                }
                .input-group input {
                    border: none;
                    flex-grow: 1;
                    padding: 5px 0;
                    font-size: 14px;
                    background: none;
                }
                .input-group input:focus {
                    outline: none;
                }
                .read-only-group {
                    background-color: #f5f5f5;
                    border-color: #eee;
                }
                .read-only-group .input-icon {
                    color: #aaa;
                }
                .btn-save {
                    width: 100%;
                    padding: 10px;
                    background-color: #5d9cec;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 15px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-save:hover {
                    background-color: #4a89e0;
                }
                .btn-save:disabled {
                    background-color: #a0c4f7;
                    cursor: not-allowed;
                }
                .status-message {
                    padding: 10px;
                    margin-bottom: 15px;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;