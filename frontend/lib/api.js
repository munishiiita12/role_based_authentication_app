/**
 * API Client
 * Handles all API requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Makes an API request with automatic cookie handling
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies in requests
  };

  // Add body if provided
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle no content responses (like logout)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    // Throw error for non-2xx responses
    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred');
      error.statusCode = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Re-throw API errors
    if (error.statusCode) {
      throw error;
    }
    // Handle network errors
    throw new Error('Network error. Please check your connection.');
  }
}

// Authentication API
export const authAPI = {
  signup: (data) => apiRequest('/auth/signup', {
    method: 'POST',
    body: data,
  }),

  login: (data) => apiRequest('/auth/login', {
    method: 'POST',
    body: data,
  }),

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getMe: () => apiRequest('/auth/me'),
};

// Items API
export const itemsAPI = {
  getItems: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/items${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  createItem: (data) => apiRequest('/items', {
    method: 'POST',
    body: data,
  }),

  updateItem: (id, data) => apiRequest(`/items/${id}`, {
    method: 'PATCH',
    body: data,
  }),

  deleteItem: (id) => apiRequest(`/items/${id}`, {
    method: 'DELETE',
  }),
};
