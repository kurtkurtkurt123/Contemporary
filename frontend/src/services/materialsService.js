// src/services/materialsService.js
import axios from "axios";

const API = "http://localhost:5000/api/material";

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
