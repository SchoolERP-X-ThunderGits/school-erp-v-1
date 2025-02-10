import axios from 'axios';
import {BASE_URL} from './Config'
// Set up a default base URL if needed
// Axios instance configuration (optional)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "Authorization":localStorage.getItem("token"),
    // Add any other common headers if needed, e.g. Authorization
  },
});

// GET Request
export const getService = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error in GET request', error);
    throw error;
  }
};

// POST Request
export const postService = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error in POST request', error);
    throw error;
  }
};

// PUT Request
export const putService = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error('Error in PUT request', error);
    throw error;
  }
};

// PATCH Request
export const patchService = async (url, data) => {
  try {
    const response = await api.patch(url, data);
    return response.data;
  } catch (error) {
    console.error('Error in PATCH request', error);
    throw error;
  }
};

// DELETE Request
export const deleteService = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error in DELETE request', error);
    throw error;
  }
};
