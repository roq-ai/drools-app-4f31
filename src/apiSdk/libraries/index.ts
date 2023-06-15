import axios from 'axios';
import queryString from 'query-string';
import { LibraryInterface, LibraryGetQueryInterface } from 'interfaces/library';
import { GetQueryInterface } from '../../interfaces';

export const getLibraries = async (query?: LibraryGetQueryInterface) => {
  const response = await axios.get(`/api/libraries${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLibrary = async (library: LibraryInterface) => {
  const response = await axios.post('/api/libraries', library);
  return response.data;
};

export const updateLibraryById = async (id: string, library: LibraryInterface) => {
  const response = await axios.put(`/api/libraries/${id}`, library);
  return response.data;
};

export const getLibraryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/libraries/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLibraryById = async (id: string) => {
  const response = await axios.delete(`/api/libraries/${id}`);
  return response.data;
};
