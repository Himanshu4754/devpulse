import api from './api';

export const connectRepository = async ({ githubToken, fullName }) => {
  const { data } = await api.post('/repositories', { githubToken, fullName });
  return data;
};

export const getRepositories = async () => {
  const { data } = await api.get('/repositories');
  return data;
};

export const getRepository = async (id) => {
  const { data } = await api.get(`/repositories/${id}`);
  return data;
};

export const refreshRepository = async (id) => {
  const { data } = await api.post(`/repositories/${id}/refresh`);
  return data;
};