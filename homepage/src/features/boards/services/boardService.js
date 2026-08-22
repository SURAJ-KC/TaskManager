const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to build headers with Bearer Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic response handler to parse JSON & handle HTTP errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

const boardService = {
  // ================= BOARDS =================
  getBoards: async () => {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createBoard: async (boardData) => {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(boardData),
    });
    return handleResponse(res);
  },

  getBoardDetails: async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateBoard: async (boardId, updateData) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  deleteBoard: async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // ================= LISTS =================
  createList: async (boardId, listData) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/lists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(listData),
    });
    return handleResponse(res);
  },

  updateList: async (listId, updateData) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  deleteList: async (listId) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  reorderList: async (listId, position) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}/reorder`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ position }),
    });
    return handleResponse(res);
  },

  // ================= TASKS =================
  createTask: async (listId, taskData) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  getTaskDetails: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateTask: async (taskId, updateData) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  deleteTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  assignTask: async (taskId, userIds) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userIds }),
    });
    return handleResponse(res);
  },

  // ================= COMMENTS =================
  addComment: async (taskId, text) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse(res);
  },

  getCommentsByTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  deleteComment: async (commentId) => {
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // ================= Search =================
globalSearch: async (query) => {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};


export default boardService;