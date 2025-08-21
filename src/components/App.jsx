/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import c from 'clsx';
import useStore from '../store';
import ResumeForm from './ResumeForm';
import AIReview from './AIReview';
import Preview from './Preview';
import LoadingSpinner from './LoadingSpinner';
import { ResumeIcon } from './icons';

function ProgressBar() {
  const step = useStore.use.step();
  const steps = [
    { id: 1, label: 'Add Details' },
    { id: 2, label: 'AI Enhance' },
    { id: 3, label: 'Preview & Download' },
  ];

  return (
    <div className="progress-bar">
      {steps.map((s, index) => (
        <div 
          key={s.id} 
          className={c('progress-step', {
            active: step === s.id,
            completed: step > s.id
          })}>
          <div className="step-circle">{step > s.id ? '✔' : s.id}</div>
          <div className="step-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const step = useStore.use.step();
  const processing = useStore.use.processing();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ResumeForm />;
      case 2:
        return <AIReview />;
      case 3:
        return <Preview />;
      default:
        return <ResumeForm />;
    }
  };

  return (
    <div className="app-container">
      {processing && <LoadingSpinner />}
      <header className="app-header">
        <h1>
          <ResumeIcon />
          AI Resume Builder
        </h1>
        <p>Create a professional, ATS-optimized resume in minutes.</p>
      </header>
      
      <ProgressBar />

      <main>
        {renderStep()}
      </main>
    </div>
  );
}
