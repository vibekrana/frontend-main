import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Survey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('business-type');
  const [businessType, setBusinessType] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [numColors, setNumColors] = useState(1);

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

  // Business types
  const businessTypes = [
    { value: 'other', label: 'Other', icon: '🏢' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' }
  ];

  // Common questions to be added to all business types
  const commonQuestions = [
    { 
      id: 'contact_details', 
      question: 'Please provide your contact details for the footer of promotional images (website and contact number).', 
      type: 'textarea', 
      placeholder: 'e.g., Website: www.example.com, Contact: +1234567890' 
    },
    { 
      id: 'color_theme', 
      question: 'What color theme would you prefer for your promotional images? (Select number of colors and pick using the color picker)', 
      type: 'multi-color', 
      placeholder: 'Choose number of colors' 
    },
    { 
      id: 'post_schedule_time', 
      question: 'What time would you like your social media posts to be scheduled daily?', 
      type: 'time', 
      placeholder: 'Select a time' 
    }
  ];

  // Dynamic questions based on business type
  const getQuestionsForBusinessType = (type) => {
    const questionSets = {
      'finance': [
        { id: 'financial_products', question: 'What are the main financial products or services your business offers?', type: 'textarea', placeholder: 'Describe your main financial products/services...' },
        { id: 'target_audience', question: 'Who is your target audience for social media (e.g., individuals, businesses, investors)?', type: 'text', placeholder: 'e.g., individuals, businesses, investors' },
        { id: 'social_tone', question: 'What tone do you want to convey in your social media posts?', type: 'checkbox', options: ['Trustworthy', 'Professional', 'Approachable'] },
        { id: 'image_focus', question: 'Do you prefer images that highlight trust and security, growth and success, or expert advice?', type: 'checkbox', options: ['Trust and security', 'Growth and success', 'Expert advice'] },
        { id: 'visual_style', question: 'Should your visuals lean more towards professional corporate settings or personal customer stories?', type: 'checkbox', options: ['Professional corporate settings', 'Personal customer stories'] },
        { id: 'include_data_visuals', question: 'Would you like to include infographics, graphs, or data visualizations in your posts?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'education': [
        { id: 'educational_services', question: 'What type of educational services or programs does your institution offer?', type: 'textarea', placeholder: 'Describe your educational programs...' },
        { id: 'primary_audience', question: 'Who are the primary audiences you want to engage through social media?', type: 'checkbox', options: ['Students', 'Parents', 'Faculty', 'Alumni', 'Community'] },
        { id: 'key_messages', question: 'What key messages do you want to communicate about your institution?', type: 'textarea', placeholder: 'Describe your key messages...' },
        { id: 'image_showcase', question: 'Do you prefer images showcasing student achievements, campus life, or faculty expertise?', type: 'checkbox', options: ['Student achievements', 'Campus life', 'Faculty expertise'] },
        { id: 'learning_format', question: 'Should visuals highlight in-person activities or online learning platforms?', type: 'checkbox', options: ['In-person activities', 'Online learning platforms'] },
        { id: 'feature_content', question: 'Would you like to feature events, guest lectures, or community involvement in your images?', type: 'checkbox', options: ['Events', 'Guest lectures', 'Community involvement'] },
        ...commonQuestions
      ],
      'technology': [
        { id: 'tech_products', question: 'What are your company\'s main products or services in the tech sector?', type: 'textarea', placeholder: 'Describe your tech products/services...' },
        { id: 'target_audience', question: 'Who is your target audience?', type: 'checkbox', options: ['Tech professionals', 'Consumers', 'Businesses', 'Startups', 'Enterprise'] },
        { id: 'brand_values', question: 'What brand values or qualities should your social media convey?', type: 'checkbox', options: ['Innovation', 'Reliability', 'User-friendliness', 'Cutting-edge', 'Trustworthy'] },
        { id: 'design_preference', question: 'Do you prefer futuristic, sleek designs or more practical, real-world tech visuals?', type: 'checkbox', options: ['Futuristic, sleek designs', 'Practical, real-world visuals'] },
        { id: 'image_focus', question: 'Should images focus on product demonstrations or conceptual innovation?', type: 'checkbox', options: ['Product demonstrations', 'Conceptual innovation'] },
        { id: 'include_interactive_content', question: 'Would you like to include animated or interactive visuals in your social media content?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'real-estate': [
        { id: 'property_specialization', question: 'What types of properties does your business specialize in?', type: 'checkbox', options: ['Residential', 'Commercial', 'Luxury', 'Rental', 'Investment'] },
        { id: 'main_clients', question: 'Who are your main clients?', type: 'checkbox', options: ['Buyers', 'Renters', 'Investors', 'First-time buyers', 'Commercial clients'] },
        { id: 'selling_points', question: 'What key selling points do you want to emphasize on social media?', type: 'textarea', placeholder: 'Describe your key selling points...' },
        { id: 'image_showcase', question: 'Do you prefer images showcasing property interiors, neighborhood lifestyles, or renovations?', type: 'checkbox', options: ['Property interiors', 'Neighborhood lifestyles', 'Renovations'] },
        { id: 'feature_client_stories', question: 'Should visuals feature testimonials or success stories from clients?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        // { id: 'aerial_photography', question: 'Would aerial or drone photography be useful in your social media posts?', type: 'radio', options: ['Yes', 'No', 'For certain properties'] },
        ...commonQuestions
      ],
      'healthcare': [
        { id: 'healthcare_services', question: 'What healthcare services or specialties does your business offer?', type: 'textarea', placeholder: 'Describe your healthcare services...' },
        { id: 'primary_audience', question: 'Who is your primary audience?', type: 'checkbox', options: ['Patients', 'Families', 'Healthcare professionals', 'Community', 'Insurance providers'] },
        { id: 'core_values', question: 'What core values should your social media images communicate?', type: 'checkbox', options: ['Trust', 'Care', 'Innovation', 'Expertise', 'Compassion'] },
        { id: 'image_highlight', question: 'Do you prefer images highlighting medical staff, patient care, or healthcare technology?', type: 'checkbox', options: ['Medical staff', 'Patient care', 'Healthcare technology'] },
        { id: 'visual_focus', question: 'Should visuals focus on wellness campaigns, testimonials, or facilities?', type: 'checkbox', options: ['Wellness campaigns', 'Testimonials', 'Facilities'] },
        { id: 'include_treatment_visuals', question: 'Are before-and-after treatment visuals or case studies something you want to include?', type: 'radio', options: ['Yes', 'No', 'With patient consent only'] },
        ...commonQuestions
      ],
      'ecommerce': [
        { id: 'product_types', question: 'What types of products do you sell primarily?', type: 'textarea', placeholder: 'Describe your main product categories...' },
        { id: 'main_customers', question: 'Who are your main customers or market segments?', type: 'text', placeholder: 'Describe your target customers...' },
        { id: 'brand_personality', question: 'What brand personality do you want to express through social media?', type: 'checkbox', options: ['Fun', 'Professional', 'Creative', 'Trendy', 'Trustworthy'] },
        { id: 'image_style', question: 'Do you prefer product-focused images or lifestyle shots showing your products in use?', type: 'checkbox', options: ['Product-focused images', 'Lifestyle shots'] },
        { id: 'content_highlight', question: 'Should visuals highlight seasonal sales, new arrivals, or behind-the-scenes content?', type: 'checkbox', options: ['Seasonal sales', 'New arrivals', 'Behind-the-scenes'] },
        { id: 'ugc_strategy', question: 'Would user-generated content or influencer posts be part of your social media strategy?', type: 'radio', options: ['Yes', 'No', 'Considering it'] },
        ...commonQuestions
      ],
      'restaurant': [
        { id: 'cuisine_experience', question: 'What type of cuisine and dining experience does your restaurant offer?', type: 'textarea', placeholder: 'Describe your cuisine and dining experience...' },
        { id: 'typical_customers', question: 'Who are your typical customers or target demographic?', type: 'text', placeholder: 'Describe your typical customers...' },
        { id: 'unique_qualities', question: 'What unique qualities or atmosphere do you want to communicate on social media?', type: 'textarea', placeholder: 'Describe your unique qualities...' },
        { id: 'image_preference', question: 'Do you prefer images of food presentation, dining ambiance, or kitchen activity?', type: 'checkbox', options: ['Food presentation', 'Dining ambiance', 'Kitchen activity'] },
        { id: 'content_highlight', question: 'Should visuals highlight seasonal menus, special events, or customer interactions?', type: 'checkbox', options: ['Seasonal menus', 'Special events', 'Customer interactions'] },
        { id: 'sustainability', question: 'Would you like to promote sustainable sourcing or dietary options through your visuals?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'other': [
        { id: 'business_description', question: 'What is your business type and how would you describe your business or industry?', type: 'textarea', placeholder: 'Describe your business type and industry...' },
        { id: 'target_audience', question: 'Who is your target audience or customer base?', type: 'text', placeholder: 'Describe your target audience...' },
        { id: 'key_messages', question: 'What key messages or values do you want your social media to communicate?', type: 'textarea', placeholder: 'Describe your key messages and values...' },
        { id: 'image_style', question: 'What style of images appeals most to your brand?', type: 'checkbox', options: ['Professional', 'Casual', 'Artistic', 'Modern', 'Traditional'] },
        { id: 'visual_focus', question: 'Should visuals focus more on products, services, or customer stories?', type: 'checkbox', options: ['Products', 'Services', 'Customer stories'] },
        { id: 'preferred_themes', question: 'Do you have preferred colors, moods, or themes you want reflected in your visuals?', type: 'textarea', placeholder: 'Describe your preferred colors, moods, or themes...' },
        ...commonQuestions
      ]
    };

    return questionSets[type] || questionSets['other'];
  };

  const handleBusinessTypeSelect = (type) => {
    setBusinessType(type);
    setCurrentStep('questions');
  };

  const handleAnswerChange = (questionId, value) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNumColorsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumColors(count);
    const colors = Array(count).fill('#000000');
    handleAnswerChange('color_theme', colors);
  };

  const handleColorChange = (index, value) => {
    const colors = [...(surveyAnswers['color_theme'] || Array(numColors).fill('#000000'))];
    colors[index] = value;
    handleAnswerChange('color_theme', colors);
  };

  const handleSubmitSurvey = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const surveyData = {
        businessType,
        answers: surveyAnswers,
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem('registeredUserId') || 'anonymous'
      };

      console.log('Sending survey data:', surveyData);  // Debug log

      const response = await fetch(
        'https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ surveyData })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit survey: ${errorText}`);
      }

      const data = await response.json();
      console.log('Survey submission response:', data);

      setSuccess('✅ Survey completed successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
        console.error('Error processing survey:', error);
        setError('Error processing survey. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={question.placeholder}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            value={surveyAnswers[question.id] || ''}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={question.placeholder}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            value={surveyAnswers[question.id] || ''}
            rows="4"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={question.placeholder}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            value={surveyAnswers[question.id] || ''}
          />
        );
      
      case 'time':
        return (
          <input
            type="time"
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            value={surveyAnswers[question.id] || ''}
          />
        );
      
      case 'multi-color':
        return (
          <div>
            <input
              type="number"
              min="1"
              max="5"
              value={numColors}
              onChange={handleNumColorsChange}
              style={{ marginBottom: '1rem' }}
            />
            {Array.from({ length: numColors }, (_, index) => (
              <div key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label>Color {index + 1}:</label>
                <input
                  type="color"
                  value={surveyAnswers['color_theme']?.[index] || '#000000'}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: surveyAnswers['color_theme']?.[index] || '#000000',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                ></div>
              </div>
            ))}
          </div>
        );
      
      case 'select':
        return (
          <select
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            value={surveyAnswers[question.id] || ''}
          >
            <option value="">Select an option...</option>
            {question.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="radio-group">
            {question.options.map(option => (
              <label key={option} className="radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={surveyAnswers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="checkbox-group">
            {question.options.map(option => (
              <label key={option} className="checkbox-option">
                <input
                  type="checkbox"
                  value={option}
                  checked={(surveyAnswers[question.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentAnswers = surveyAnswers[question.id] || [];
                    let newAnswers;
                    if (e.target.checked) {
                      newAnswers = [...currentAnswers, option];
                    } else {
                      newAnswers = currentAnswers.filter(a => a !== option);
                    }
                    handleAnswerChange(question.id, newAnswers);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const questions = businessType ? getQuestionsForBusinessType(businessType) : [];

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <button className="logout-button top-right" onClick={() => navigate('/login')}>
        Skip Survey
      </button>

      <div className="extra-icons">
        <span className="icon1">📋</span>
        <span className="icon2">📊</span>
        <span className="icon3">💼</span>
        <span className="icon4">🎯</span>
      </div>

      <div className="login-box" style={{ maxWidth: '600px', width: '90%' }}>
        <img src="/logo1922.png" alt="Logo" className="login-logo" />
        <h1 className="login-header">Business Survey</h1>
        <p className="login-subheader">Help us understand your business better</p>

        {currentStep === 'business-type' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-color)' }}>
              What type of business do you have?
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {businessTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleBusinessTypeSelect(type.value)}
                  className="business-type-btn"
                  type="button"
                >
                  <span className="business-icon">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'questions' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-color)' }}>
              Questions for {businessTypes.find(t => t.value === businessType)?.label}
            </h3>

            <form onSubmit={(e) => e.preventDefault()}>
              {questions.map((question, index) => (
                <div key={question.id} className="form-group">
                  <label>
                    {index + 1}. {question.question}
                  </label>
                  {renderQuestionInput(question)}
                </div>
              ))}

              {error && (
                <div className="response-error">
                  <div className="response-icon">!</div>
                  <div className="response-content">
                    <p>{error}</p>
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep('business-type')}
                  className="post-button secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmitSurvey}
                  disabled={isSubmitting}
                  className="post-button"
                  style={{ flex: 2 }}
                >
                  {isSubmitting ? <span className="spinner"></span> : 'Submit Survey'}
                </button>
              </div>
            </form>
          </div>
        )}

        <style jsx>{`
          .business-type-btn {
            padding: 1rem;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-color);
          }
          
          .business-type-btn:hover {
            border-color: var(--accent-color);
            background: var(--accent-color-light);
          }
          
          .business-icon {
            font-size: 1.5rem;
          }
          
          .radio-group, .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .radio-option, .checkbox-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
          }
          
          .radio-option:hover, .checkbox-option:hover {
            background: var(--bg-secondary);
          }
          
          .post-button.secondary {
            background: var(--bg-secondary);
            color: var(--text-color);
            border: 2px solid var(--border-color);
          }
          
          .post-button.secondary:hover {
            background: var(--border-color);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Survey;