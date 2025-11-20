import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect,
    useCallback 
} from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🚀 Wrapped fetchUser in useCallback to give it a stable identity.
  const fetchUser = useCallback(async () => {
    // We only try to fetch user details if we are authenticated
    if (!isAuthenticated) { 
        setUser(null);
        setLoading(false);
        return;
    }
    
    try {
        const response = await apiClient.get('/auth/users/me/'); 
        setUser(response.data);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If the token is bad, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
    } finally {
        setLoading(false);
    }
    // Dependency array for useCallback: This function only needs to change if isAuthenticated changes
  }, [isAuthenticated]); 


  // Check for tokens on initial load and load user data
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    // 1. Initial check for token
    if (accessToken) {
      setIsAuthenticated(true);
      // 2. Fetch user details (will run when the component mounts)
      fetchUser(); 
    } else {
      // If no token, we are done loading
      setLoading(false);
    }
  }, [fetchUser]); // Fixed: Added fetchUser to the dependency array


  // --- API Functions ---

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/jwt/create/', { email, password });

      const { access, refresh } = response.data;

      // 2. Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // 3. Set state to authenticated (This triggers the fetchUser via its dependency)
      setIsAuthenticated(true);
      
      return true; // Success
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      throw error; 
    }
  };
  
  const register = async (email, password, firstName, lastName) => {
    try {
        await apiClient.post('/auth/users/', { 
            email, 
            password, 
            password2: password, 
            first_name: firstName,
            last_name: lastName
        });
        
        return true; // Registration success
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
        throw error;
    }
  };
  
  const logout = () => {
    // Clear tokens and reset state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null); 
    setIsAuthenticated(false);
    setLoading(false); // Ensure the app isn't stuck loading after logout
  };
  
  // 🏅 NEW: A dedicated function to update the user data after a successful patch call.
  // This is used by ProfilePage.js and is essential for stabilization.
  const updateUser = (newUserData) => {
    setUser(prevUser => ({
        ...prevUser, 
        ...newUserData
    }));
  };


  // The value provided to components
  const contextValue = {
    user, 
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    // 🏆 ADDED: updateUser function for profile changes 
    updateUser, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};