import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDarkMode(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error message when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            username: formData.username.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        setSuccess('✅ Registration successful! Taking you to the survey...');
        
        // Store user info for survey
        if (data.userId) {
          localStorage.setItem('registeredUserId', data.userId);
        }
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        
        // Navigate to survey after 1.5 seconds
        setTimeout(() => {
          navigate('/survey');
        }, 1500);

      } else {
        // Registration failed - handle different error types
        if (response.status === 400 || response.status === 409) {
          // Handle duplicate user errors
          if (data.error) {
            const errorMessage = data.error.toLowerCase();
            
            if (errorMessage.includes('username') && errorMessage.includes('already')) {
              setValidationErrors({ 
                username: 'This username is already taken. Please choose another one.' 
              });
            } else if (errorMessage.includes('email') && errorMessage.includes('already')) {
              setValidationErrors({ 
                email: 'This email is already registered. Please use a different email or try logging in.' 
              });
            } else if (errorMessage.includes('user') && errorMessage.includes('already')) {
              setError('An account with these details already exists. Please try logging in instead.');
            } else {
              setError(data.error);
            }
          } else {
            setError('User already exists. Please try logging in or use different credentials.');
          }
        } else if (response.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(data.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <button className="logout-button top-right" onClick={() => navigate('/login')}>
        Back
      </button>

      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

      <div className="login-box">
        <img src="/logo1922.png" alt="Logo" className="login-logo" />
        <h1 className="login-header">Marketing Bot</h1>
        <p className="login-subheader">Create Your Account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className={validationErrors.name ? 'error' : ''}
              required
            />
            {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className={validationErrors.email ? 'error' : ''}
              required
            />
            {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleInputChange}
              className={validationErrors.username ? 'error' : ''}
              required
            />
            {validationErrors.username && <span className="field-error">{validationErrors.username}</span>}
            <small className="field-hint">Letters, numbers, and underscores only. Min 3 characters.</small>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              className={validationErrors.password ? 'error' : ''}
              required
            />
            {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
            <small className="field-hint">Minimum 6 characters required.</small>
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={validationErrors.confirmPassword ? 'error' : ''}
              required
            />
            {validationErrors.confirmPassword && <span className="field-error">{validationErrors.confirmPassword}</span>}
          </div>

          {error && (
            <div className="response-error">
              <div className="response-icon">!</div>
              <div className="response-content">
                <p>{error}</p>
                {error.includes('already') && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
                    <a 
                      href="/login" 
                      style={{ color: '#facc15', textDecoration: 'underline' }}
                    >
                      Click here to login instead
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
          
          {success && (
            <div className="response-success">
              <div className="response-icon">✓</div>
              <div className="response-content">
                <p>{success}</p>
              </div>
            </div>
          )}

          <button type="submit" className="post-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: '#22d3ee' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#facc15', fontWeight: 'bold' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;