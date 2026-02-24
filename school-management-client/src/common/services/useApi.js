import { useState, useEffect } from 'react';
import { baseURL } from '../configs/urls';
import ApiError from './ApiError';

function useApi() {
    const [resData, setResData] = useState(null);
    const [resError, setResError] = useState(null);

    const [loading, setLoading] = useState(false);
    let error = null;

    const callAPI = async (specialURL, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        setResData(null);
        setResError(null);

        try {
            console.log('call ', baseURL + specialURL, method, body, headers);

            const response = await fetch(baseURL + specialURL, {
                method,
                headers: { 'Content-Type': 'application/json', ...headers },
                body: body ? JSON.stringify(body) : null,
            });

            if (!response.ok) {
                error = await response.json();
                throw new ApiError(error);
            }

            const result = await response.json();
            setResData(result);
        } catch (e) {
            if (e.message === 'Failed to fetch' || e.message.includes('ERR_NAME_NOT_RESOLVED')) {
                console.error('Network error: Could not resolve the API server address.');
                setResError('Network error: Unable to connect to the server. Please check your connection.');
            } else if (error.error_code === 'BAD_REQUEST') {
                setResError(error.error_message);
            } else {
                console.error('API call error:', e);
                throw e; // Re-throw other errors for handling in the component
            }
        } finally {
            setLoading(false);
        }
    };

    return { resData, resError, loading, callAPI };
}

export default useApi;
