import { api } from ".";

export const createMeetingRequest = async (formdata) => api.post('/meeting/create',formdata);
export const getsMeetingRequest = async (isScheduled) => api.get(`/meeting/get${isScheduled ? '?isScheduled=true':''}`);
export const getMeetingByIdRequest = async (id) => api.get(`/meeting/get/${id}`);
