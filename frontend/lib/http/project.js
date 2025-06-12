import { api } from ".";

export const createProjectRequest = async (FormData) => api.post('/project',FormData);
export const getProjectRequest = async (project_id) => api.get(`/project/${project_id}`);
export const getAllProjectRequest = async () => api.get(`/project/`);
export const invitePeopleRequest = async (formdata,project_id) => api.post(`/project/${project_id}/invite`,formdata);
export const sendViaMailRequest = async (formdata) => api.post(`/project/send-via-mail`,formdata);
export const joinProjectRequest = async (formdata) => api.post(`/project/join`,formdata);


export const createFolderRequest = async (formdata) => api.post(`/project/folder`,formdata);
export const createFileRequest = async (formdata) => api.post(`/project/file`,formdata,{
    headers: {
        'Content-Type': 'application/form-data'
    }
});

export const updateFileRequest = async (formdata) => api.put(`/project/file/update`,formdata,{
    headers: {
        'Content-Type': 'application/form-data'
    }
});
export const getFilesRequest = async (id) => api.get(`/project/tree/${id}`);
export const getTemplateFileRequest = async () => api.get(`/project/get-file`);
export const sendToLawyerRequest = async (formdata) => api.post(`/project/send`,formdata,{
    headers: {
        'Content-Type': 'application/form-data'
    }
});
export const sendToClientRequest = async (formdata) => api.post(`/project/send-client`,formdata,{
    headers: {
        'Content-Type': 'application/form-data'
    }
});

export const updateLawyerSendedDocumentRequest = async (id,formdata) => api.put(`/project/update-t-document-status/${id}`,formdata);


