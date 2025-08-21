/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export default function ModernTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="resume-modern">
      <header className="header">
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phoneNumber && <span>{personalInfo.phoneNumber}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedIn && <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">Portfolio</a>}
        </div>
      </header>

      {summary && (
        <section className="section summary-section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="section experience-section">
          <h2>Work Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="experience-item">
              <div className="item-title">
                <h3>{exp.jobTitle || 'Job Title'}</h3>
                <p>{exp.startDate} - {exp.endDate}</p>
              </div>
              <div className="item-subtitle">
                <p>{exp.company || 'Company Name'}</p>
                <p>{exp.location || 'Location'}</p>
              </div>
              <ul className="responsibilities">
                {exp.responsibilities.map((resp, i) => resp && <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education && education.length > 0 && (
        <section className="section education-section">
          <h2>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="education-item">
              <div className="item-title">
                <h3>{edu.school || 'School Name'}</h3>
                <p>{edu.graduationDate || 'Graduation Date'}</p>
              </div>
              <div className="item-subtitle">
                 <p>{edu.degree || 'Degree'}</p>
                 <p>{edu.location || 'Location'}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="section skills-section">
          <h2>Skills</h2>
          <div className="skills-list">
            {skills.map((skill, i) => skill && <span key={i}>{skill}</span>)}
          </div>
        </section>
      )}
    </div>
  );
}
