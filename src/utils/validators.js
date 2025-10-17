export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateTaskTitle = (title) => {
  return title.trim().length > 0;
};

export const TASK_STATUSES = ["Pending", "In Progress", "Completed"];

export const validateTaskStatus = (status) => {
  return TASK_STATUSES.includes(status);
};
