import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getCurrentUser();

        if (token && user) {
          // Verify token is still valid by fetching profile
          const profile = await authService.getProfile();
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: profile,
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.SET_LOADING,
            payload: false,
          });
        }
      } catch (error) {
        // Token is invalid, clear storage
        authService.logout();
        dispatch({
          type: AUTH_ACTIONS.LOGOUT,
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({
        type: AUTH_ACTIONS.SET_LOADING,
        payload: true,
      });
      dispatch({
        type: AUTH_ACTIONS.CLEAR_ERROR,
      });

      const userData = await authService.login(credentials);
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: userData,
      });

      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({
        type: AUTH_ACTIONS.SET_LOADING,
        payload: true,
      });
      dispatch({
        type: AUTH_ACTIONS.CLEAR_ERROR,
      });

      const newUser = await authService.register(userData);
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: newUser,
      });

      toast.success(`Welcome to Smart Notes, ${newUser.name}!`);
      return newUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    dispatch({
      type: AUTH_ACTIONS.LOGOUT,
    });
    toast.info('You have been logged out');
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      const profile = await authService.getProfile();
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: profile,
      });
      return profile;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({
      type: AUTH_ACTIONS.CLEAR_ERROR,
    });
  };

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;