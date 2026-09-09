import axios from 'axios';
import API_BASE_URL, { getAuthHeaders } from '../../../services/apiClient';

const boardService = {
  // ================= BOARDS =================
  getBoards: async () => {
    const res = await axios.get(`${API_BASE_URL}/boards`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  createBoard: async (boardData) => {
    const res = await axios.post(`${API_BASE_URL}/boards`, boardData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  getBoardDetails: async (boardId) => {
    const res = await axios.get(`${API_BASE_URL}/boards/${boardId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  updateBoard: async (boardId, updateData) => {
    const res = await axios.patch(`${API_BASE_URL}/boards/${boardId}`, updateData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  deleteBoard: async (boardId) => {
    const res = await axios.delete(`${API_BASE_URL}/boards/${boardId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // ================= LISTS =================
  createList: async (boardId, listData) => {
    const res = await axios.post(`${API_BASE_URL}/boards/${boardId}/lists`, listData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  updateList: async (listId, updateData) => {
    const res = await axios.patch(`${API_BASE_URL}/lists/${listId}`, updateData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  deleteList: async (listId) => {
    const res = await axios.delete(`${API_BASE_URL}/lists/${listId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  reorderList: async (listId, position) => {
    const res = await axios.patch(
      `${API_BASE_URL}/lists/${listId}/reorder`,
      { position },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  // ================= TASKS =================
  createTask: async (listId, taskData) => {
    const res = await axios.post(`${API_BASE_URL}/lists/${listId}/tasks`, taskData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  getTaskDetails: async (taskId) => {
    const res = await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  updateTask: async (taskId, updateData) => {
    const res = await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, updateData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  deleteTask: async (taskId) => {
    const res = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  assignTask: async (taskId, userIds) => {
    const res = await axios.patch(
      `${API_BASE_URL}/tasks/${taskId}/assign`,
      { userIds },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  // ================= COMMENTS =================
  addComment: async (taskId, text) => {
    const res = await axios.post(
      `${API_BASE_URL}/tasks/${taskId}/comments`,
      { text },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  getCommentsByTask: async (taskId) => {
    const res = await axios.get(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  deleteComment: async (commentId) => {
    const res = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // ================= SEARCH =================
  globalSearch: async (query) => {
    const res = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query },
      headers: getAuthHeaders(),
    });
    return res.data;
  },
};

export default boardService;