import api from './api';

export const compareRepositories = async (repoIdA, repoIdB) => {
  const { data } = await api.get('/repositories/compare', {
    params: { repoIdA, repoIdB }
  });
  return data;
};