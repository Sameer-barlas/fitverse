import client from './client.js';

export const getExercises = (params = {}) => {
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });
  return client.get('/exercises', { params: cleanParams });
};

export const getExerciseFilters = () => client.get('/exercises/filters');

export const getExerciseById = (id) => client.get(`/exercises/${id}`);
