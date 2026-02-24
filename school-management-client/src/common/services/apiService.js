import { baseURL } from '../configs/urls';
import ApiError from './ApiError';

const apiCallNoPage = async (specialURL, method = 'GET', body = null, headers = {}) => {
    let errorData = null;
    try {
        const url = `${baseURL}${specialURL}`;
        console.log('Calling API...', url, method, 'Body:', body);

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            errorData = await response.json();
            console.error(`API call failed: ${url} - Error:`, errorData);
            throw new Error(errorData.message || errorData.errorMessage || 'An error occurred while processing the request.');
        }

        const data = await response.json();
        console.log(`API call successful: ${url} - Data:`, data);

        // Determine response structure and parse accordingly
        if (data._embedded) {
            console.log('Data structure contains111 "data" key:', data.data);

            const embeddedKey = Object.keys(data._embedded)[0];
            return { response: data._embedded[embeddedKey], errorMessage: null };
        } else if (data.data) {
            console.log('Data structure contains "data" key:', data.data);
            return { response: data.data, errorMessage: null };
        } else {
            console.log('Data 2222 contains "data" key:', data.data);

            return { response: data, errorMessage: null }; // Fallback for unexpected structures
        }
    } catch (e) {
        return { response: null, errorMessage: errorData ? errorData.message || e.message : 'An unexpected error occurred.' };
    }
};

const apiCallV2WithPage = async (specialURL, method = 'GET', body = null, headers = {}) => {
    let errorData = null;
    try {
        const url = `${baseURL}${specialURL}`;
        console.log('Calling API...', url, method, 'Body:', body);

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            errorData = await response.json();
            console.error(`API call failed: ${url} - Error:`, errorData);
            throw new Error();
        }

        const data = await response.json();
        console.log(`API call successful: ${url} - Data:`, data);

        return { response: parseV2Response(data), errorMessage: null };
    } catch (e) {
        return { response: null, errorMessage: errorData ? errorData.error_message : e.message };
    }
};

const apiCallV0WithPage = async (specialURL, method = 'GET', body = null, headers = {}) => {
    let errorData = null;
    try {
        const url = `${baseURL}${specialURL}`;
        console.log('Calling API...', url, method, 'Body:', body);

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            errorData = await response.json();
            console.error(`API call failed: ${url} - Error:`, errorData);
            throw new Error();
        }

        const data = await response.json();
        console.log(`API call successful: ${url} - Data:`, data);

        return { response: parseV0Response(data), errorMessage: null };
    } catch (e) {
        return { response: null, errorMessage: errorData ? errorData.message : e.message };
    }
};

const parseV0Response = (data) => {
    const embeddedKey = data._embedded ? Object.keys(data._embedded)[0] : null;
    return {
        content: embeddedKey ? data._embedded[embeddedKey] : [],
        pageable: {
            size: data.page.size,
            totalElements: data.page.totalElements,
            totalPages: data.page.totalPages,
            number: data.page.number,
        },
    };
};

const parseV2Response = (data) => ({
    content: data.data.content,
    pageable: {
        pageNumber: data.data.pageable.pageNumber,
        pageSize: data.data.pageable.pageSize,
        sort: data.data.pageable.sort,
        offset: data.data.pageable.offset,
        paged: data.data.pageable.paged,
        unpaged: data.data.pageable.unpaged,
    },
    totalElements: data.data.totalElements,
    totalPages: data.data.totalPages,
    size: data.data.size,
    number: data.data.number,
    sort: data.data.sort,
    first: data.data.first,
    last: data.data.last,
    numberOfElements: data.data.numberOfElements,
    empty: data.data.empty,
});

export { apiCallNoPage, apiCallV2WithPage, apiCallV0WithPage };
