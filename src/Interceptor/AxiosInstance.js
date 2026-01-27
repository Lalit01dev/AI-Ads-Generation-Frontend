import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TIMEOUTS = {
  DEFAULT: 300000,
  LONG_RUNNING: 360000,
  UPLOAD: 1200000,
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUTS.DEFAULT,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";

      if (!config.timeout) {
        config.timeout = TIMEOUTS.UPLOAD;
      }
    } else {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }
    if (config.url?.includes("/generate_campaign_videos") && !config.timeout) {
      config.timeout = TIMEOUTS.LONG_RUNNING;
    }
    if (config.url?.includes("/generate_beauty_campaign") && !config.timeout) {
      config.timeout = TIMEOUTS.DEFAULT;
    }

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Request Timeout:", config.timeout, "ms");

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.metadata?.startTime) {
      const endTime = Date.now();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Response: ${response.config.url} - ${duration}ms`);
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Something went wrong";
    if (error.code === "ECONNABORTED") {
      const url = error.config?.url || "the request";
      const timeout = error.config?.timeout || TIMEOUTS.DEFAULT;
      const timeoutInMinutes = Math.round(timeout / 60000);

      toast.warning(
        `Request to ${url.split("/").pop() || "server"} is taking longer than expected. ` +
          `It may still be processing. Please wait or try again later.`,
        {
          autoClose: 10000,
          position: "top-right",
        },
      );

      return Promise.reject({
        isTimeout: true,
        message: `Request timeout after ${timeoutInMinutes} minutes`,
        originalError: error,
        url: error.config?.url,
        timeout: timeout,
      });
    }

    if (!error.response) {
      toast.error("Network error. Please check your internet connection.", {
        autoClose: 5000,
      });
      return Promise.reject({
        isNetworkError: true,
        message: "Network error. Please check your connection.",
        originalError: error,
      });
    }
    if ([400, 403, 404, 409].includes(status)) {
      switch (status) {
        case 400:
          toast.error(message || "Bad Request", { autoClose: 5000 });
          break;
        case 403:
          toast.error("Access denied", { autoClose: 5000 });
          break;
        case 404:
          toast.error("Resource not found", { autoClose: 5000 });
          break;
        case 409:
          toast.error("Conflict occurred", { autoClose: 5000 });
          break;
      }
    } else if (status >= 500) {
      toast.error(
        message || "Server error. Please try again after some time.",
        {
          autoClose: 7000,
        },
      );
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isTimeoutError = (error) => {
  return error?.isTimeout === true || error?.code === "ECONNABORTED";
};

export const isNetworkError = (error) => {
  return error?.isNetworkError === true || !error?.response;
};

export default axiosInstance;
