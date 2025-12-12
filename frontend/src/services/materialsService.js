// src/services/materialsService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// PALITAN ANG BASE URL: Gumagamit na ng API_URL
const API = `${API_URL}/api/material`;

// --- NEW UTILITY FUNCTION: Para Kumuha ng JWT Token ---
const getToken = () => localStorage.getItem('token');
// ----------------------------------------------------

export const createMaterial = async (payload) => {
  return await axios.post(`${API}/create`, payload, {
    headers: {
      // ADDED: Idagdag ang token sa header
      'Authorization': `Bearer ${getToken()}`, 
      "Content-Type": "multipart/form-data" 
    }
  });
};

export const getMaterials = async () => {
  return await axios.get(`${API}/get`, {
    headers: {
      // ADDED: Idagdag ang token para sa read access
      'Authorization': `Bearer ${getToken()}` 
    }
  });
};

export const getMaterialById = async (item_code) => {
  return await axios.get(`${API}/${item_code}`, {
    headers: {
      // ADDED: Idagdag ang token
      'Authorization': `Bearer ${getToken()}` 
    }
  });
};

export const updateMaterial = async (item_code, payload) => {
  return await axios.put(`${API}/${item_code}`, payload, {
    headers: {
      // ADDED: Idagdag ang token
      'Authorization': `Bearer ${getToken()}`, 
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteMaterial = async (item_code) => {
  return await axios.delete(`${API}/${item_code}`, {
    headers: {
      // ADDED: Idagdag ang token
      'Authorization': `Bearer ${getToken()}` 
    }
  });
};