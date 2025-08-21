/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import useStore from '../store';
import { enhanceResume, parseResumePdf } from '../gemini';
import { PlusIcon, TrashIcon, UploadIcon, FileIcon } from './icons';

// Set worker source for pdfjs. This is crucial for it to work in the browser.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function ResumeForm() {
  const {
    resumeData,
    updateResumeData,
    addExperience,
    removeExperience,
    updateExperience,
    addResponsibility,
    updateResponsibility,
    removeResponsibility,
    addEducation,
    removeEducation,
    updateEducation,
    addSkill,
    updateSkill,
    removeSkill,
    setStep,
    setProcessing,
    setSuggestions,
    uploadedPdf,
    uploadError,
    setUploadedPdf,
    clearUploadedPdf,
    setUploadError,
    setFullResumeData,
  } = useStore();

  const fileInputRef = React.useRef(null);
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleChange = (path, value) => {
    updateResumeData(path, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setUploadError('Invalid file type. Please upload a PDF.');
        return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
    }
    
    setUploadedPdf(file);
  };

  const handleRemoveFile = () => {
      clearUploadedPdf();
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  React.useEffect(() => {
    if (!uploadedPdf) return;

    const processPdf = async () => {
      setProcessing(true, 'Parsing your resume...');
      try {
        const fileBuffer = await uploadedPdf.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(fileBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n';
        }

        const parsedData = await parseResumePdf(fullText);

        const validatedData = {
          personalInfo: parsedData.personalInfo || { fullName: '', email: '', phoneNumber: '', address: '', linkedIn: '', website: '' },
          summary: parsedData.summary || '',
          experience: (parsedData.experience || []).map(exp => ({ ...exp, id: crypto.randomUUID(), responsibilities: exp.responsibilities || [''] })),
          education: (parsedData.education || []).map(edu => ({ ...edu, id: crypto.randomUUID() })),
          skills: parsedData.skills?.length > 0 ? parsedData.skills : [''],
        };

        setFullResumeData(validatedData);
        
      } catch (error) {
        console.error('Failed to process PDF:', error);
        setUploadError('Could not read data from PDF. Please fill the form manually.');
        clearUploadedPdf();
      } finally {
        setProcessing(false);
      }
    };

    processPdf();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedPdf]);

  const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true, 'Enhancing your resume with AI...');
    try {
      const suggestions = await enhanceResume(resumeData);
      setSuggestions(suggestions);
      setStep(2);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      setSuggestions(null);
      setStep(2);
    } finally {
        setProcessing(false);
    }
  };


  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* PDF Uploader */}
      <div className="form-section">
        <h2>Import from PDF</h2>
        <div className="pdf-uploader-container">
            {!uploadedPdf ? (
                <>
                    <input
                        type="file"
                        id="pdf-upload"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <label htmlFor="pdf-upload" className="btn btn-secondary">
                        <UploadIcon />
                        Upload Resume PDF
                    </label>
                    <p className="upload-hint">Or fill out the form manually below.</p>
                    {uploadError && <p className="upload-error">{uploadError}</p>}
                </>
            ) : (
                <div className="file-info">
                    <FileIcon />
                    <div className="file-details">
                        <span className="file-name" title={uploadedPdf.name}>{uploadedPdf.name}</span>
                        <span className="file-size">{formatBytes(uploadedPdf.size)}</span>
                    </div>
                    <button type="button" className="remove-btn" onClick={handleRemoveFile}>
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Personal Info */}
      <div className="form-section">
        <h2>Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" value={resumeData.personalInfo.fullName} onChange={(e) => handleChange('personalInfo.fullName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleChange('personalInfo.email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" type="tel" value={resumeData.personalInfo.phoneNumber} onChange={(e) => handleChange('personalInfo.phoneNumber', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" value={resumeData.personalInfo.address} onChange={(e) => handleChange('personalInfo.address', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="linkedIn">LinkedIn Profile</label>
            <input id="linkedIn" type="url" value={resumeData.personalInfo.linkedIn} onChange={(e) => handleChange('personalInfo.linkedIn', e.target.value)} />
          </div>
           <div className="form-group">
            <label htmlFor="website">Personal Website/Portfolio</label>
            <input id="website" type="url" value={resumeData.personalInfo.website} onChange={(e) => handleChange('personalInfo.website', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="form-section">
        <h2>Professional Summary</h2>
        <div className="form-group">
          <textarea placeholder="Write a brief summary of your career objectives and qualifications." value={resumeData.summary} onChange={(e) => handleChange('summary', e.target.value)}></textarea>
        </div>
      </div>
      
      {/* Work Experience */}
      <div className="form-section">
        <h2>Work Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="dynamic-list-item">
            <div className="item-header">
                <h3>Experience #{index + 1}</h3>
                <button type="button" className="remove-btn" onClick={() => removeExperience(exp.id)}><TrashIcon/></button>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Job Title</label><input type="text" value={exp.jobTitle} onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)} /></div>
              <div className="form-group"><label>Company</label><input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
              <div className="form-group"><label>Location</label><input type="text" value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} /></div>
              <div className="form-group"><label>Start Date</label><input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} /></div>
              <div className="form-group"><label>End Date</label><input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} /></div>
            </div>
            <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Responsibilities / Achievements</label>
                <div className="responsibilities-list">
                    {exp.responsibilities.map((resp, rIndex) => (
                        <div key={rIndex} className="form-group">
                            <input type="text" value={resp} onChange={e => updateResponsibility(exp.id, rIndex, e.target.value)} placeholder={`Responsibility #${rIndex + 1}`} />
                            <button type="button" className="remove-btn" onClick={() => removeResponsibility(exp.id, rIndex)}><TrashIcon/></button>
                        </div>
                    ))}
                </div>
                 <button type="button" className="add-btn" onClick={() => addResponsibility(exp.id)}><PlusIcon/> Add Responsibility</button>
            </div>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addExperience}><PlusIcon/> Add Experience</button>
      </div>

       {/* Education */}
      <div className="form-section">
        <h2>Education</h2>
        {resumeData.education.map((edu, index) => (
             <div key={edu.id} className="dynamic-list-item">
                <div className="item-header"><h3>Education #{index + 1}</h3><button type="button" className="remove-btn" onClick={() => removeEducation(edu.id)}><TrashIcon/></button></div>
                <div className="form-grid">
                    <div className="form-group"><label>Degree / Field of Study</label><input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                    <div className="form-group"><label>School / University</label><input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} /></div>
                    <div className="form-group"><label>Location</label><input type="text" value={edu.location} onChange={e => updateEducation(edu.id, 'location', e.target.value)} /></div>
                    <div className="form-group"><label>Graduation Date</label><input type="text" value={edu.graduationDate} onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)} /></div>
                </div>
             </div>
        ))}
         <button type="button" className="add-btn" onClick={addEducation}><PlusIcon/> Add Education</button>
      </div>
      
      {/* Skills */}
      <div className="form-section">
        <h2>Skills</h2>
        <div className="form-grid">
        {resumeData.skills.map((skill, index) => (
            <div key={index} className="form-group">
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input type="text" value={skill} onChange={e => updateSkill(index, e.target.value)} placeholder={`Skill #${index + 1}`} />
                    <button type="button" className="remove-btn" onClick={() => removeSkill(index)}><TrashIcon/></button>
                </div>
            </div>
        ))}
        </div>
        <button type="button" className="add-btn" onClick={addSkill}><PlusIcon/> Add Skill</button>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
            Enhance with AI ✨
        </button>
      </div>
    </form>
  );
}