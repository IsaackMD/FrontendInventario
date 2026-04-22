import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_API; // cámbialo

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});


// 🧠 Interceptor de respuesta (manejo de errores global)
api.interceptors.response.use(
  (response) => response.data, // 👈 te regresa solo data directo
  (error) => {
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.message || "Error en la petición",
      data: error.response?.data,
    };

    console.error("API ERROR:", customError);
    return Promise.reject(customError);
  },
);

export default api;
