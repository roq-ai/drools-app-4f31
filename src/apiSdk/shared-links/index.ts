import axios from 'axios';
import queryString from 'query-string';
import { SharedLinkInterface, SharedLinkGetQueryInterface } from 'interfaces/shared-link';
import { GetQueryInterface } from '../../interfaces';

export const getSharedLinks = async (query?: SharedLinkGetQueryInterface) => {
  const response = await axios.get(`/api/shared-links${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSharedLink = async (sharedLink: SharedLinkInterface) => {
  const response = await axios.post('/api/shared-links', sharedLink);
  return response.data;
};

export const updateSharedLinkById = async (id: string, sharedLink: SharedLinkInterface) => {
  const response = await axios.put(`/api/shared-links/${id}`, sharedLink);
  return response.data;
};

export const getSharedLinkById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/shared-links/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSharedLinkById = async (id: string) => {
  const response = await axios.delete(`/api/shared-links/${id}`);
  return response.data;
};
