/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export default function CreativeTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="resume-creative">
      <aside className="left-column">
        <header className="header">
          <h1>{personalInfo.fullName || 'Your Name'}</h1>
        </header>

        <section className="left-section contact-section">
          <h2>Contact</h2>
          <div className="contact-info">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>}
            {personalInfo.phoneNumber && <span>{personalInfo.phoneNumber}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.linkedIn && <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">Portfolio</a>}
          </div>
        </section>

        {skills && skills.length > 0 && (
          <section className="left-section skills-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {skills.map((skill, i) => skill && <span key={i}>{skill}</span>)}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
            <section className="left-section education-section">
                <h2>Education</h2>
                {education.map(edu => (
                    <div key={edu.id} className="education-item">
                        <h3>{edu.degree || 'Degree'}</h3>
                        <p>{edu.school || 'School Name'}</p>
                        <p>{edu.graduationDate || 'Graduation Date'}</p>
                    </div>
                ))}
            </section>
        )}
      </aside>

      <main className="right-column">
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
              <div key={exp.id} className="experience-item">
                <div className="item-title">
                  <h3>{exp.jobTitle || 'Job Title'}</h3>
                  <p>{exp.startDate} - {exp.endDate}</p>
                </div>
                <div className="item-subtitle">
                  <p>{exp.company || 'Company Name'} | {exp.location || 'Location'}</p>
                </div>
                <ul className="responsibilities">
                  {exp.responsibilities.map((resp, i) => resp && <li key={i}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}