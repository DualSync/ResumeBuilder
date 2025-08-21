/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import c from 'clsx';
import html2pdf from 'html2pdf.js';
import useStore from '../store';
import ModernTemplate from './templates/Modern';
import ClassicTemplate from './templates/Classic';
import CreativeTemplate from './templates/Creative';
import { DownloadIcon } from './icons';

const templates = {
  modern: { name: 'Modern', component: ModernTemplate },
  classic: { name: 'Classic', component: ClassicTemplate },
  creative: { name: 'Creative', component: CreativeTemplate },
};

export default function Preview() {
  const { resumeData } = useStore();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isDownloading, setIsDownloading] = useState(false);

  const TemplateComponent = templates[selectedTemplate].component;

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById('resume-preview-content');
    const personalInfo = resumeData.personalInfo;
    const fileName = `${personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_${selectedTemplate}.pdf`;

    const options = {
      margin:       0.5,
      filename:     fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error("Could not generate PDF:", error);
      alert("Sorry, there was an error generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="preview-container">
      <aside className="preview-controls">
        <h3>Template</h3>
        <div className="template-options">
          {Object.entries(templates).map(([key, { name }]) => (
            <button
              key={key}
              className={c({ active: selectedTemplate === key })}
              onClick={() => setSelectedTemplate(key)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="preview-actions">
          <button className="btn btn-primary" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
                <>
                    <span className="btn-spinner"></span>
                    Generating...
                </>
            ) : (
                <>
                    <DownloadIcon />
                    Download PDF
                </>
            )}
          </button>
        </div>
      </aside>
      <section className="resume-preview">
        <div id="resume-preview-content">
            <TemplateComponent data={resumeData} />
        </div>
      </section>
    </div>
  );
}