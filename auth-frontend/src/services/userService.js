import api from '../api/axios';

export const fetchProfile = async () => {
    const res = await api.get('/user/profile');
    return res.data;
};
