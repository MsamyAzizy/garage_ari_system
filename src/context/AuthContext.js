import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect,
    // 🛑 ADDED: useCallback for function stability
    useCallback 
} from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🚀 FIXED: Wrapped fetchUser in useCallback to give it a stable identity.
  // It must be placed before the useEffect that uses it.
  const fetchUser = useCallback(async () => {
    // We only try to fetch user details if we are authenticated
    if (!isAuthenticated) { 
        setUser(null);
        setLoading(false);
        return;
    }
    
    try {
        // Assuming your Django backend has a protected endpoint at /auth/user/
        const response = await apiClient.get('/auth/user/'); 
        setUser(response.data);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If the token is bad, log the user out
        // Note: You should define logout here or pass it as a dependency if needed, 
        // but for a simple fix, we'll keep the necessary logic inline or use a state update.
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
  // 🛑 FIXED: Now depends only on the stable `fetchUser` function.
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
      // 1. Get tokens from Django Simple JWT endpoint
      const response = await apiClient.post('/auth/token/', { email, password });

      const { access, refresh } = response.data;

      // 2. Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // 3. Set state to authenticated (This triggers the fetchUser via its dependency)
      setIsAuthenticated(true);
      
      // 4. NOTE: We rely on the useEffect/useCallback chain to fetch the user 
      // when isAuthenticated changes, but calling it directly is also fine.
      // await fetchUser(); 

      return true; // Success
    } catch (error) {
      // 🛑 THIS CATCH BLOCK EXECUTES ON FAILED LOGIN 🛑
      console.error('Login failed:', error.response ? error.response.data : error.message);
      
      // Ensure state is FALSE and storage is clear on failure
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Re-throw the error so the LoginPage can catch it and display a message.
      throw error; 
    }
  };
  
  // Registration function (remains the same)
  const register = async (email, password, firstName, lastName) => {
    try {
        await apiClient.post('/auth/register/', { 
            email, 
            password, 
            password2: password, 
            first_name: firstName,
            last_name: lastName
        });
        
        return true; // Registration success
    } catch (error) {
        // If the registration API call fails, throw the error.
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
  
  // The value provided to components
  const contextValue = {
    user, 
    isAuthenticated,
    loading,
    login,
    logout,
    register, 
  };

  // The 'loading' state now accurately reflects token check and user data fetching status
  // We use the App.js loader instead of this simple div, but kept for context.
  // if (loading) {
  //   return <div>Loading...</div>; 
  // }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};