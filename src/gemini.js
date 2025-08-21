/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";

// Lazily initialize the AI client to avoid accessing process.env on page load.
let aiInstance;
function getAiClient() {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiInstance;
}

const enhanceSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { 
            type: Type.STRING, 
            description: 'An improved professional summary, rewritten to be a compelling and concise professional statement under 150 words.' 
        },
        experience: {
            type: Type.ARRAY,
            description: "A list of work experiences, with rewritten responsibilities.",
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    responsibilities: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 3-5 improved, action-oriented bullet points for responsibilities. Start each with a strong verb and quantify achievements where possible.",
                    },
                },
            },
        },
    },
};

export async function enhanceResume(resumeData) {
    const ai = getAiClient();
    const prompt = `
        You are an expert resume writer and career coach. Your task is to enhance the provided resume content to be more professional, impactful, and ATS-friendly.
        Follow these instructions precisely:
        1.  Rewrite the summary to be a compelling professional statement. It should be concise and highlight key qualifications and career goals.
        2.  For each work experience provided, rewrite the list of responsibilities. Each list should contain 3-5 action-oriented bullet points. Start each bullet point with a strong action verb (e.g., "Managed," "Developed," "Led," "Accelerated"). Quantify achievements with metrics where possible (e.g., "Increased sales by 15%").
        3.  Return ONLY the JSON object that adheres to the provided schema. Do not include any introductory text, markdown formatting, or explanations.

        Here is the user's resume data to enhance:
        Summary: ${resumeData.summary}
        Experience: ${JSON.stringify(resumeData.experience.map(e => ({ jobTitle: e.jobTitle, company: e.company, responsibilities: e.responsibilities.filter(r => r) })))}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: enhanceSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a fallback structure in case of API error
        return {
            summary: `(AI enhancement failed) ${resumeData.summary}`,
            experience: resumeData.experience.map(exp => ({...exp, responsibilities: [...exp.responsibilities, "(AI enhancement failed)"]}))
        };
    }
}

const fullResumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "Full name of the person." },
                email: { type: Type.STRING, description: "Email address." },
                phoneNumber: { type: Type.STRING, description: "Phone number." },
                address: { type: Type.STRING, description: "Full address (city, state, zip)." },
                linkedIn: { type: Type.STRING, description: "URL of the LinkedIn profile." },
                website: { type: Type.STRING, description: "URL of personal website or portfolio." },
            }
        },
        summary: {
            type: Type.STRING,
            description: "The professional summary or objective statement from the resume."
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    responsibilities: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    location: { type: Type.STRING },
                    graduationDate: { type: Type.STRING }
                }
            }
        },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
};

export async function parseResumePdf(pdfText) {
    const ai = getAiClient();
    const prompt = `
        You are an expert resume parser. Your task is to extract information from the provided resume text and structure it into a JSON format.
        - Extract all personal and contact information.
        - Extract the professional summary.
        - For each work experience, extract the job title, company, location, dates, and a list of responsibilities/achievements.
        - For each education entry, extract the degree, school, location, and graduation date.
        - Extract a list of skills.
        - If a field is not found, return an empty string or an empty array for lists.
        - Return ONLY the JSON object that adheres to the provided schema. Do not include any introductory text, markdown formatting, or explanations.

        Resume Text:
        ---
        ${pdfText}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: fullResumeSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for PDF parsing:", error);
        throw new Error("AI failed to parse resume data.");
    }
}