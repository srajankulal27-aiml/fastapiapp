import api from "./api";

export const analyseResume = async (resume: string) => {
  const res = await api.post(`/rag/analyse-resume`, {
    resume_text: resume,
  });
  return res.data;
};

export const semanticSearch = async (query: string) => {
  const res = await api.post(`/rag/search`, {
    query,
  });
  return res.data;
};

export const askAI = async (question: string) => {
  const res = await api.post(`/rag/ask`, {
    question,
  });
  return res.data;
};

export const jobMatch = async (skills: string, experience: string) => {
  const res = await api.post(`/rag/job-match`, {
    skills,
    experience,
  });
  return res.data;
};

export const embedJobs = async () => {
  const res = await api.post(`/rag/embed-jobs`);
  return res.data;
};