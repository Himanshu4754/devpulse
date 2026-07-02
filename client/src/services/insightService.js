import api from './api';

export const getInsights = async (repoId) => {
  const { data } = await api.get(`/repositories/${repoId}/insights`);
  return data;
};

export const regenerateInsights = async (repoId) => {
  const { data } = await api.post(`/repositories/${repoId}/insights/regenerate`);
  return data;
};