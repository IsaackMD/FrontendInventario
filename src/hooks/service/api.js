import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_API;

if (!BASE_URL) {
  console.log('No se encontro el base url');
  throw new Error("VITE_URL_API no está definida");
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.message || "Error en la peticion",
      data: error.response?.data,
    };

    console.error("API ERROR:", customError);
    return Promise.reject(customError);
  },
);

export function toArrayResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.value)) return response.value;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;

  return [];
}

const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  deleteWithBody: (url, data, config) =>
    apiClient.delete(url, {
      ...config,
      data,
    }),
};

export default api;
