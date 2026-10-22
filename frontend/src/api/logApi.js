import client from './client.js';

export const createLog = (payload) => client.post('/logs', payload);

export const getLogs = (params = {}) => {
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });
  return client.get('/logs', { params: cleanParams });
};

export const getLogById = (id) => client.get(`/logs/${id}`);

export const updateLog = (id, payload) => client.put(`/logs/${id}`, payload);

export const deleteLog = (id) => client.delete(`/logs/${id}`);
