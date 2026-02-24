import { apiCallNoPage, apiCallV0WithPage, apiCallV2WithPage } from '../apiService';

export const generateBillingCycleForRange = async (payload) => {
    return await apiCallNoPage('/v2/billing-cycles/generate-range', 'POST', payload);
};

export const collectionForRange = async (payload) => {
    return await apiCallNoPage('/v2/billing-cycles/collection-range', 'POST', payload);
};

export const getSessionsByCourseId = async (courseId) => await apiCallNoPage(`/courses/${courseId}/classSessions`, 'GET');

export const filterBillingCycles = async (filters) => {
    console.log('filters', filters);
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    return await apiCallV2WithPage(`/v2/billing-cycles/filter?${queryParams.toString()}`, 'GET');
};
