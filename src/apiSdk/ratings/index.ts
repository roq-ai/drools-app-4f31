import axios from 'axios';
import queryString from 'query-string';
import { RatingInterface, RatingGetQueryInterface } from 'interfaces/rating';
import { GetQueryInterface } from '../../interfaces';

export const getRatings = async (query?: RatingGetQueryInterface) => {
  const response = await axios.get(`/api/ratings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRating = async (rating: RatingInterface) => {
  const response = await axios.post('/api/ratings', rating);
  return response.data;
};

export const updateRatingById = async (id: string, rating: RatingInterface) => {
  const response = await axios.put(`/api/ratings/${id}`, rating);
  return response.data;
};

export const getRatingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/ratings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRatingById = async (id: string) => {
  const response = await axios.delete(`/api/ratings/${id}`);
  return response.data;
};
