export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const isValidToken = token && token !== 'undefined' && token !== 'null';

  return {
    'Content-Type': 'application/json',
    ...(isValidToken ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleResponse = async (response) => {
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.reason || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  // Construct URL cleanly
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const defaultHeaders = getAuthHeaders();
  const mergedHeaders = { ...defaultHeaders, ...(options.headers || {}) };

  const config = {
    ...options,
    headers: mergedHeaders,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

export default API_BASE_URL;