import { api } from ".";

export const createProjectRequest = async (FormData) => api.post('/project',FormData);
export const getProjectRequest = async (project_id) => api.get(`/project/${project_id}`);
export const getAllProjectRequest = async () => api.get(`/project/`);
export const invitePeopleRequest = async (formdata,project_id) => api.post(`/project/${project_id}/invite`,formdata);
export const sendViaMailRequest = async (formdata) => api.post(`/project/send-via-mail`,formdata);
export const joinProjectRequest = async (formdata) => api.post(`/project/join`,formdata);