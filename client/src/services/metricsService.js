import api from './api';

export const getRepositoryMetrics = async (repoId) => {
  const { data } = await api.get(`/repositories/${repoId}/metrics`);
  return data;
};