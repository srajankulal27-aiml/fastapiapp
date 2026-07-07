import axios from "axios";

const API = "http://127.0.0.1:8000/rag";

export const analyseResume = async (resume: string) => {
  const res = await axios.post(`${API}/analyse-resume`, {
    resume_text: resume,
  });

  return res.data;
};

export const semanticSearch = async (query: string) => {
  const res = await axios.post(`${API}/search`, {
    query,
  });

  return res.data;
};

export const askAI = async (question: string) => {
  const res = await axios.post(`${API}/ask`, {
    question,
  });

  return res.data;
};

export const jobMatch = async (
  skills: string,
  experience: string
) => {
  const res = await axios.post(`${API}/job-match`, {
    skills,
    experience,
  });

  return res.data;
};

export const embedJobs = async () => {
  const res = await axios.post(`${API}/embed-jobs`);

  return res.data;
};