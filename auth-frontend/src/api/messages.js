import api from './axios';

export const getMessages = async (conversationId) => {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    return res.data;
}

export const sendMessage = async (conversationId, text) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { text });
    return res.data;
}