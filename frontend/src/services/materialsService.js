// src/services/materialsService.js
import axios from "axios";

// IDAGDAG ANG LINYA NA ITO (Kukunin ang Render API URL mula sa .env)
const API_URL = import.meta.env.VITE_API_BASE_URL;

// PALITAN ANG BASE URL: Gumagamit na ng API_URL
const API = `${API_URL}/api/material`;

export const createMaterial = async (payload) => {
  return await axios.post(`${API}/create`, payload);
};

export const getMaterials = async () => {
  return await axios.get(`${API}/get`);
};

export const getMaterialById = async (item_code) => {
  return await axios.get(`${API}/${item_code}`);
};

export const updateMaterial = async (item_code, payload) => {
  return await axios.put(`${API}/${item_code}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteMaterial = async (item_code) => {
  return await axios.delete(`${API}/${item_code}`);
};