import { apiCallNoPage, apiCallV0WithPage } from '../apiService';

export const fetchReceipts = async (filters) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    return await apiCallV0WithPage(`//receipts?${queryParams.toString()}`, 'GET');
};

export const fetchReceiptDetails = async (id) => await apiCallNoPage(`/receipts/${id}`, 'GET');

export const createReceipt = async (studentCode, data) => {
    return await apiCallNoPage(`/v2/receipts/${studentCode}`, 'POST', data);
};

export const updateReceipt = async (studentCode, data) => {
    return await apiCallNoPage(`/v2/receipts/${studentCode}`, 'PUT', data);
};
