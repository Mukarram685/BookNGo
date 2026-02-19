import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { updateTokens, logout } from "../store/slice/auth.slice";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: 'http://192.168.18.16:3000/api/v1/',
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {

      const state = store?.getState();
      const token = state?.auth?.token;

      if (token && !config.noAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `%cSuccess: ${response?.config?.url}`,
      "color: green; background-color:rgb(225, 255, 230); font-weight: bold; padding: 8px;",
      response?.data
    );
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Call refresh token endpoint using a separate axios instance or direct call
        // to avoid infinite loops with the interceptor
        const response = await axios.post('http://192.168.18.16:3000/api/v1/refresh-token', {
          refreshToken
        });

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          store.dispatch(updateTokens({
            token: accessToken,
            refreshToken: newRefreshToken
          }));

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    const errorResponse = {
      status: error?.response?.status,
      data: error?.response?.data,
    };

    console.log(
      `%cError: ${error?.config?.url}`,
      "color: red; background-color:rgb(255, 225, 225); font-weight: bold; padding: 8px;",
      errorResponse
    );

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
