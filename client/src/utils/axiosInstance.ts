import axios from 'axios';

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: never) => void }[] = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: unknown) => {
            if (typeof token === 'string') {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            }
            return Promise.reject('Token is not a string');
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      return new Promise(function (resolve, reject) {
        axios
          .post('/auth/refresh-token', { refreshToken })
          .then(({ data }) => {
            localStorage.setItem('token', data.access_token);
            axiosInstance.defaults.headers.common['Authorization'] =
              'Bearer ' + data.access_token;
            originalRequest.headers['Authorization'] =
              'Bearer ' + data.access_token;

            processQueue(null, data.access_token);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

function processQueue(error: never, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

export default axiosInstance;
