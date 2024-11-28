import { api } from ".";

export const createProjectRequest = async (FormData) => api.post('/project',FormData);
export const getProjectRequest = async (project_id) => api.get(`/project/${project_id}`);