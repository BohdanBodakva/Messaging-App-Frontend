import axios from 'axios';

const backendUrl = "http://192.168.0.223:5001"

async function makeRequest(
    method, url, body={}, headers={},
){
    const token = localStorage.getItem("token");
    if (token) {
        headers['x-access-token'] = token;
    }

    let response;
    try {
        if (method === "GET") {
            response = await axios.get(`${backendUrl}${url}`, {headers});
        } else if (method === "POST") {
            response = await axios.post(`${backendUrl}${url}`, body, {headers});
        } else {
            throw new Error(`Unknown HTTP method: '${method}'`);
        }
    } catch (error) {
        throw error;
    }

    return response;
}

export default makeRequest;