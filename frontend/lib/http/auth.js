import { api } from ".";

export const registerRequest = async (FormData) => api.post('/user/register',FormData);
export const loginRequest = async (FormData) => api.post('/user/login',FormData);
export const resendotpRequest = async (FormData) => api.post('/user/resend-otp',FormData);
export const verifyotpRequest = async (FormData) => api.post('/user/verify',FormData);
export const loadUserRequest = async () => api.get('/user/get');