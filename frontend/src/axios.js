import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8090',
    withCredentials: true, // ✅ 모든 요청에 쿠키 자동 포함
});

export default instance;
