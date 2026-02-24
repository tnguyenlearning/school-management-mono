import { apiCallNoPage, apiCallV0WithPage, apiCallV2WithPage } from '~/common/services/apiService';

export const createStudentAccount = async (accountData) => apiCallNoPage('/v2/student-accounts', 'POST', accountData);

export const searchStudentAccounts = async (filters) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    return await apiCallV2WithPage(`/v2/student-accounts/search/findStudentAccounts?${queryParams.toString()}`, 'GET');
};

export const searchPayments = async (filters) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });

    return await apiCallV0WithPage(`/v0/payments/search/searchPayments?${queryParams.toString()}`, 'GET');
};

export const searchReceipts = async (filters) => {
    console.log('filters', filters);
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    console.log('queryParams', queryParams.toString());
    return await apiCallV0WithPage(`/v0/receipts/search/searchReceipts?${queryParams.toString()}`, 'GET');
};
