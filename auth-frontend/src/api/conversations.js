import api from './axios';

export const getConversations = async () => {
    const res = await api.get(`/conversations`);
    return res.data;
}

export const createConversation = async (userId) => {
    const res = await api.post(`/conversations`, { userId });
    return res.data;
}

export const searchUser = async (query) => {
    const res = await api.get(`/users/search?q=${query}`);
    return res.data;
}
