import api from '../api/axios';

export const registerRequest = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
};
