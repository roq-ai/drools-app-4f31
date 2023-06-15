import axios from 'axios';
import queryString from 'query-string';
import { Mp3Interface, Mp3GetQueryInterface } from 'interfaces/mp-3';
import { GetQueryInterface } from '../../interfaces';

export const getMp3s = async (query?: Mp3GetQueryInterface) => {
  const response = await axios.get(`/api/mp-3s${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMp3 = async (mp3: Mp3Interface) => {
  const response = await axios.post('/api/mp-3s', mp3);
  return response.data;
};

export const updateMp3ById = async (id: string, mp3: Mp3Interface) => {
  const response = await axios.put(`/api/mp-3s/${id}`, mp3);
  return response.data;
};

export const getMp3ById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/mp-3s/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMp3ById = async (id: string) => {
  const response = await axios.delete(`/api/mp-3s/${id}`);
  return response.data;
};
