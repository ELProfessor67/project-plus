import { api } from ".";

export const createTaskRequest = async (FormData) => api.post('/task',FormData);
export const updateTaskRequest = async (FormData,task_id) => api.put(`/task/${task_id}`,FormData);
export const getTaskByIdRequest = async (task_id) => api.get(`/task/${task_id}`);
export const addTaskTranscribtionRequest = async (formdata) => api.post(`/task/transcribe`,formdata,{
    headers: {
       'Content-Type': 'multipart/form-data',
    }
});
export const addTaskCommentsRequest = async (formdata) => api.post(`/task/comment`,formdata);
export const getTaskCommentsRequest = async (task_id) => api.get(`/task/comment/${task_id}`);
export const sendTaskEmailRequest = async (formdata) => api.post(`/task/email`,formdata);
export const sendEmailToClientRequest = async (formdata) => api.post(`/task/email/client`,formdata);
export const getTaskEmailRequest = async (date) => api.get(`/task/emails/get-emails${date ? `?date=${date}`: ''}`);
export const getTaskProgressRequest = async (id,date) => api.get(`/task/progress/get-progress/${id}${date ? `?date=${date}`: ''}`);
export const createTimeRequest = async (id) => api.post(`/task/time/${id}`);
export const stopTimeRequest = async (id,formdata) => api.post(`/task/time-stop/${id}`,formdata);
export const getAllTaskProgressRequest = async (date, type, project_id) => {
    const params = {};
    if (date) params.date = date;
    if (type) params.type = type;
    if (project_id) params.project_id = project_id;
  
    return api.get('/task/progress/get-progress', { params });
  };
export const getConnectMailsRequest = async () => api.get(`/task/get-connect-mails`);