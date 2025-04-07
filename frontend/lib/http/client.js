import { api } from ".";

export const getDocuemtnRequest = async (id) => api.get(`/client/get-all/${id}`);
export const getUpdatesRequest = async (id) => api.get(`/client/get-updates/${id}`);
export const getOverviewRequest = async (date, user_id, project_id) => {
    const params = new URLSearchParams();

    if (date) params.append("date", date);
    if (user_id) params.append("user_id", user_id);
    if (project_id) params.append("project_id", project_id);

    return api.get(`/client/get-overview?${params.toString()}`);
};

export const getByDateRange = async (startDate,endDate,project_client_id) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return api.get(`/client/get-by-date-range/${project_client_id}?${params.toString()}`);
};

export const requestDocuemtnRequest = async (formdata) => api.post(`/client/request`, formdata);
export const updateStatusRequest = async (formdata) => api.post(`/client/status`, formdata);




export const getBillingRequest = async (id) => api.get(`/client/get-all-billing/${id}`);
export const createBillingRequest = async (formdata) => api.post(`/client/create-billing`, formdata);
export const updateBillingStatusRequest = async (formdata) => api.post(`/client/status-billing`, formdata);


export const getFilledRequest = async (id) => api.get(`/client/get-all-filed/${id}`);
export const updateFiledStatusRequest = async (formdata) => api.post(`/client/status-filed`, formdata);


export const getSignedRequest = async (id) => api.get(`/client/get-all-signed/${id}`);
export const updateSignedStatusRequest = async (formdata) => api.post(`/client/status-signed`, formdata);


export const getPedingDocsRequest = async () => api.get(`/client/get-peding-documents`);
export const getPedingDocsByIdRequest = async (id) => api.get(`/client/get-peding-documents/${id}`);

export const uploadDocumentRequest = async (formdata) => api.post(`/client/upload/`, formdata, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});


export const createFiledRequest = async (formdata) => api.post(`/client/create-filed`, formdata, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});


export const createSignRequest = async (formdata) => api.post(`/client/create-signed`, formdata, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});

export const uploadSignRequest = async (formdata) => api.post(`/client/upload-signed`, formdata, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});


export const giveUpdateRequest = async (formdata) => api.post(`/client/give-update/`, formdata, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
