import client from './client.js';

export const getPlans = (params = {}) => {
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });
  return client.get('/plans', { params: cleanParams });
};

export const getRecommendedPlan = () => client.get('/plans/recommended');

export const getPlanById = (id) => client.get(`/plans/${id}`);
