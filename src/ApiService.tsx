import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

interface ApiService {
  get: <T>(
    path: string,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  post: <T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  put: <T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  delete: <T>(
    path: string,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  patch: <T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
}

const ApiService: ApiService = {
  get: (path, config) => api.get(path, config),
  post: (path, data, config) => api.post(path, data, config),
  put: (path, data, config) => api.put(path, data, config),
  delete: (path, config) => api.delete(path, config),
  patch: (path, data, config) => api.patch(path, data, config),
};

export default ApiService;
