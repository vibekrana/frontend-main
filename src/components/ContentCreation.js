import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentCreation.css';

const ContentCreation = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState('');
  const [contentType, setContentType] = useState('');
  const [platforms, setPlatforms] = useState({
    instagram: false,
    x: false,
    linkedin: false,
    facebook: false,
  });
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setPlatforms((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectAll = () => {
    setPlatforms({ instagram: true, x: true, linkedin: true, facebook: true });
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!prompt.trim()) newErrors.prompt = 'Marketing theme is required';
    if (!numImages) newErrors.numImages = 'Please select the number of images';
    if (!contentType) newErrors.contentType = 'Please select a content type';
    if (!Object.values(platforms).includes(true)) {
      newErrors.platforms = 'Please select at least one platform';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isRetry = false) => {
    e?.preventDefault();
    if (validateForm() || isRetry) {
      setIsLoading(true);
      const payload = isRetry ? lastPayload : { prompt, numImages, contentType, platforms };
      setLastPayload(payload);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://13.233.45.167:5000/content/generate',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setResponseMessage('Content generated successfully!');
        setIsError(false);
        setLastPayload(null);
        console.log('Backend Response:', response.data);
        setErrors({});
      } catch (err) {
        setResponseMessage(err.response?.data?.error || 'Failed to generate content.');
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setPrompt('');
    setNumImages('');
    setContentType('');
    setPlatforms({ instagram: false, x: false, linkedin: false, facebook: false });
    setErrors({});
    setResponseMessage('');
    setIsError(false);
    setLastPayload(null);
  };

  return (
    <div className={`content-creation-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">🛰️</span>
        <span className="icon4">🤖</span>
      </div>

      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      <button className="logout-button top-right" onClick={handleLogout}>
        🚪 Logout
      </button>

      <div className="content-creation-box">
        <div className="header-section">
          <h1 className="content-creation-header">CraftingBrain</h1>
          <h2 className="content-creation-subheader">Create Social Media Content</h2>
          <div className="header-decoration"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prompt">Marketing Theme</label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Promote a new eco-friendly product"
              required
            />
            {errors.prompt && <span className="error-message">{errors.prompt}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="numImages">Number of Images</label>
            <select
              id="numImages"
              value={numImages}
              onChange={(e) => setNumImages(e.target.value)}
              required
            >
              <option value="" disabled>Choose number of images</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {errors.numImages && <span className="error-message">{errors.numImages}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contentType">Content Type</label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              required
            >
              <option value="" disabled>Choose content type</option>
              {["Informative", "Inspirational", "Promotional", "Educational","Engaging"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.contentType && <span className="error-message">{errors.contentType}</span>}
          </div>

          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-grid">
              {Object.entries(platforms).map(([key, value]) => (
                <label key={key} className={`platform-card ${value ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handlePlatformChange}
                    className="platform-checkbox"
                  />
                  <div className="platform-content">
                    <span className="platform-name">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <button type="button" className="select-all-button" onClick={handleSelectAll}>
              Select All Platforms
            </button>
            {errors.platforms && <span className="error-message">{errors.platforms}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="post-button" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : 'Generate & Post'}
            </button>
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {responseMessage && (
          <div className={isError ? 'response-error' : 'response-success'}>
            <div className="response-icon">{isError ? '!' : '✓'}</div>
            <div className="response-content">
              <p>{responseMessage}</p>
              {isError && (
                <button
                  type="button"
                  className="retry-button"
                  onClick={() => handleSubmit(null, true)}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="spinner"></span> : 'Retry'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreation;
