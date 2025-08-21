/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import 'immer'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';

const initialResumeData = {
  personalInfo: {
    fullName: '', email: '', phoneNumber: '', address: '', linkedIn: '', website: '',
  },
  summary: '',
  experience: [
    { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] },
  ],
  education: [
    { id: crypto.randomUUID(), degree: '', school: '', location: '', graduationDate: '' },
  ],
  skills: [''],
};

const useStore = create(
  immer((set) => ({
    step: 1, // 1: Form, 2: AI Review, 3: Preview
    resumeData: initialResumeData,
    aiSuggestions: null,
    processing: false,
    processingMessage: 'Enhancing your resume with AI...',
    uploadedPdf: null,
    uploadError: '',
    
    // Step Navigation
    setStep: (step) => set({ step }),

    // Data Actions
    setFullResumeData: (data) => set({ resumeData: data }),
    updateResumeData: (path, value) => {
      set(state => {
        const keys = path.split('.');
        let current = state.resumeData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      });
    },

    // Experience Actions
    addExperience: () => set(state => {
      state.resumeData.experience.push({ id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] });
    }),
    removeExperience: (id) => set(state => {
      state.resumeData.experience = state.resumeData.experience.filter(exp => exp.id !== id);
    }),
    updateExperience: (id, field, value) => set(state => {
      const exp = state.resumeData.experience.find(e => e.id === id);
      if (exp) exp[field] = value;
    }),
    addResponsibility: (expId) => set(state => {
      const exp = state.resumeData.experience.find(e => e.id === expId);
      if (exp) exp.responsibilities.push('');
    }),
    updateResponsibility: (expId, respIndex, value) => set(state => {
      const exp = state.resumeData.experience.find(e => e.id === expId);
      if (exp) exp.responsibilities[respIndex] = value;
    }),
    removeResponsibility: (expId, respIndex) => set(state => {
      const exp = state.resumeData.experience.find(e => e.id === expId);
      if (exp) exp.responsibilities.splice(respIndex, 1);
    }),

    // Education Actions
    addEducation: () => set(state => {
      state.resumeData.education.push({ id: crypto.randomUUID(), degree: '', school: '', location: '', graduationDate: '' });
    }),
    removeEducation: (id) => set(state => {
      state.resumeData.education = state.resumeData.education.filter(edu => edu.id !== id);
    }),
    updateEducation: (id, field, value) => set(state => {
        const edu = state.resumeData.education.find(e => e.id === id);
        if (edu) edu[field] = value;
    }),

    // Skills Actions
    addSkill: () => set(state => { state.resumeData.skills.push(''); }),
    updateSkill: (index, value) => set(state => { state.resumeData.skills[index] = value; }),
    removeSkill: (index) => set(state => { state.resumeData.skills.splice(index, 1); }),

    // AI Processing Actions
    setProcessing: (isProcessing, message = 'Enhancing your resume with AI...') => set({
      processing: isProcessing,
      processingMessage: message,
    }),
    setSuggestions: (suggestions) => set({ aiSuggestions: suggestions }),

    // PDF Upload Actions
    setUploadedPdf: (file) => set({ uploadedPdf: file, uploadError: '' }),
    clearUploadedPdf: () => set({ uploadedPdf: null }),
    setUploadError: (error) => set({ uploadError: error }),
  }))
);

export default createSelectorFunctions(useStore);