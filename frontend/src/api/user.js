import axios from 'axios';

async signupApi(params) {
    let response = await axios.post('/api/user/signup', params);
    return response;
}

async loginApi(params) {
    let response = await axios.post('/api/user/signup', params);
    return response;
}

export { signupApi, loginApi };