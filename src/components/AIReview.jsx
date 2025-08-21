/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from '../store';

const SuggestionCard = ({ title, original, suggestion, onAccept }) => {
  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <h3>{title}</h3>
      </div>
      <div className="suggestion-body">
        <div className="suggestion-content">
          <h4>Original</h4>
          {original}
        </div>
        <div className="suggestion-content">
          <h4>✨ AI Suggestion</h4>
          {suggestion}
        </div>
      </div>
      <div className="suggestion-actions">
        <button className="btn btn-primary" onClick={onAccept}>
          Accept Suggestion
        </button>
      </div>
    </div>
  );
};

export default function AIReview() {
  const { resumeData, aiSuggestions, updateResumeData, setStep } = useStore();

  if (!aiSuggestions) {
    return (
      <div className="review-container">
        <h2>AI Suggestions</h2>
        <p>No suggestions available. Please go back and fill out your resume details.</p>
        <div className="form-actions">
           <button className="btn btn-primary" onClick={() => setStep(1)}>Back to Form</button>
        </div>
      </div>
    );
  }

  const handleAcceptSummary = () => {
    updateResumeData('summary', aiSuggestions.summary);
  };
  
  const handleAcceptExperience = (index) => {
    const originalExp = resumeData.experience[index];
    const suggestedExp = aiSuggestions.experience[index];
    
    // Create a new experience object with merged data
    const newExperience = {
        ...originalExp,
        responsibilities: suggestedExp.responsibilities,
    };
    
    // Create a copy of the experience array
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = newExperience;
    
    // Update the store
    updateResumeData('experience', updatedExperience);
  };


  return (
    <div className="review-container">
      <h2>Review AI Suggestions</h2>
      <p style={{textAlign: 'center', marginBottom: '2rem'}}>Review the AI-powered suggestions below and accept the ones you like.</p>

      {aiSuggestions.summary && (
        <SuggestionCard
          title="Professional Summary"
          original={<p>{resumeData.summary}</p>}
          suggestion={<p>{aiSuggestions.summary}</p>}
          onAccept={handleAcceptSummary}
        />
      )}

      {aiSuggestions.experience?.map((exp, index) => (
        <SuggestionCard
          key={resumeData.experience[index].id}
          title={`Experience: ${exp.jobTitle} at ${exp.company}`}
          original={
            <ul>
              {resumeData.experience[index].responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
            </ul>
          }
          suggestion={
            <ul>
              {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
            </ul>
          }
          onAccept={() => handleAcceptExperience(index)}
        />
      ))}

      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => setStep(3)}>
          Continue to Preview
        </button>
      </div>
    </div>
  );
}
