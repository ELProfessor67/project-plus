import { api } from ".";

export const getChatUserRequest = async () => api.get('/chat/get-users');
export const getConversationIdRequest = async (formData) => api.post('/chat/get-conversation-id',formData);
export const getConversationRequest = async (conversation_id) => api.get(`/chat/get-conversations/${conversation_id}`);
