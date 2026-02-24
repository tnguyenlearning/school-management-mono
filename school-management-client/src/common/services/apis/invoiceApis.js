import { apiCallV0WithPage } from '../apiService';

export const getInvoices = async (filters) => {
    console.log(' getInvoices filters', filters);
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    console.log('queryParams getInvoices', queryParams.toString());

    return await apiCallV0WithPage(`//invoices/search/searchInvoices?${queryParams.toString()}`, 'GET');
};
