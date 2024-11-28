import { api } from ".";

export const createTaskRequest = async (FormData) => api.post('/task',FormData);
export const updateTaskRequest = async (FormData,task_id) => api.put(`/task/${task_id}`,FormData);