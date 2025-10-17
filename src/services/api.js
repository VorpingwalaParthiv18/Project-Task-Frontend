// const import.meta.env.VITE_PORT
//  = "http://localhost:5000";

const handleResponse = async (response) => {
  const data = await response.json();
  return data;
};

export const authAPI = {
  register: async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return handleResponse(response);
  },
};

export const taskAPI = {
  getTasks: async (token) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    return handleResponse(response);
  },

  createTask: async (token, taskData) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/tasks/p`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
      credentials: "include",
    });
    return handleResponse(response);
  },

  updateTask: async (token, id, taskData) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
      credentials: "include",
    });
    return handleResponse(response);
  },

  deleteTask: async (token, id) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    return handleResponse(response);
  },
  getActivities: async (token, id) => {
    const response = await fetch(`${import.meta.env.VITE_PORT
}/tasks/getUser`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    return handleResponse(response);
  },
};
