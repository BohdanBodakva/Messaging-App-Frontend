import axios from 'axios';

const EXPIRED_TOKEN_MESSAGE = 'Expired token';

const backendUrl = "http://192.168.0.223:5001"

async function sendRequestToBackend(
    method, url, body={}, headers={},
) {
    let response;

    if (method === "GET") {
        response = await axios.get(`${backendUrl}${url}`, {headers});
    } else if (method === "POST") {
        response = await axios.post(`${backendUrl}${url}`, body, {headers});
    } else if (method === "PUT") {
        response = await axios.put(`${backendUrl}${url}`, body, {headers});
    } else if (method === "PATCH") {
        response = await axios.patch(`${backendUrl}${url}`, body, {headers});
    } else if (method === "DELETE") {
        response = await axios.delete(`${backendUrl}${url}`, {headers});
    } else {
        throw new Error(`Unrecognized HTTP method: ${method}`);
    }

    return response;
}


export async function refreshAccessToken() {
    const refresh_token = localStorage.getItem("refresh_token");

    if (refresh_token) {
        const headers = {
            'Authorization': `Bearer ${refresh_token}`
        };

        try {
            const refreshTokenResponse = await sendRequestToBackend(
                "POST", "/auth/refresh", {}, headers
            )

            const new_access_token = refreshTokenResponse.data.access_token;

            if (new_access_token) {
                localStorage.setItem("access_token", new_access_token);
                return new_access_token;
            } else {
                throw new Error(`Unrecognized access token: ${new_access_token}`);
            }
        } catch (error) {
            const refreshTokenResponse = error.response;

            if (refreshTokenResponse.status === 401 &&
                refreshTokenResponse.data.error === EXPIRED_TOKEN_MESSAGE) {
                throw new Error("refresh_token has expired");
            } else {
                throw new Error(error);
            }
        }
    } else {
        throw new Error(`refresh_token is missing`);
    }
}


export default async function makeRequest(
    method, url, body={}, headers={},
){
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response;
    let errorMessage = "";
    try {
        response = await sendRequestToBackend(method, url, body, headers);
    } catch (error) {
        response = error.response;

        // If access_token has expired
        if (response.status === 401 && response.data.msg === EXPIRED_TOKEN_MESSAGE) {

            // refresh access_token
            const new_access_token = await refreshAccessToken()
            if (new_access_token) {
                headers['Authorization'] = `Bearer ${new_access_token}`;
            }

            let secondResponse;
            try {
                secondResponse = await sendRequestToBackend(
                    method, url, body, headers
                );
            } catch (error) {
                secondResponse = error.response;
                errorMessage = secondResponse.data.msg;
            }
            response = secondResponse

        } else {
            errorMessage = response.data.msg;
        }
    }

    return {
        "response": response,
        "errorMessage": errorMessage,
    };
}
