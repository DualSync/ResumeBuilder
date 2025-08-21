/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export default function ClassicTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="resume-classic">
      <header className="header">
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          <span>{personalInfo.address}</span>
          {personalInfo.address && (<span> | </span>)}
          <span>{personalInfo.email}</span>
          {personalInfo.email && (<span> | </span>)}
          <span>{personalInfo.phoneNumber}</span>
          {(personalInfo.linkedIn || personalInfo.website) && (<span> | </span>)}
          {personalInfo.linkedIn && <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {personalInfo.linkedIn && personalInfo.website && (<span> | </span>)}
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
          <h2>Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="item">
              <div className="item-title">
                <h3>{exp.jobTitle || 'Job Title'}</h3>
                <span>{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="item-subtitle">
                <p>{exp.company || 'Company Name'}</p>
                <span>{exp.location || 'Location'}</span>
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
            <div key={edu.id} className="item">
              <div className="item-title">
                <h3>{edu.degree || 'Degree'}</h3>
                <span>{edu.graduationDate || 'Graduation Date'}</span>
              </div>
              <div className="item-subtitle">
                 <p>{edu.school || 'School Name'}</p>
                 <p>{edu.location || 'Location'}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="section skills-section">
          <h2>Skills</h2>
          <p className="skills-list">
            {skills.filter(s => s).join(' | ')}
          </p>
        </section>
      )}
    </div>
  );
}