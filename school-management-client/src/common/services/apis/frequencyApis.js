import { apiCallNoPage } from '../apiService';

export const getFrequencyOptions = async () => await apiCallNoPage('/v0/billing-frequency', 'GET');

export const getFrequencyOptionById = async (id) => {
    const { response, errorMessage } = await apiCallNoPage(`/v0/billing-frequency/${id}`, 'GET');
    if (errorMessage) {
        return { response: null, errorMessage };
    }

    return { response: response, errorMessage };
};

export const createFrequencyOption = async (frequencyData) => apiCallNoPage('/v0/billing-frequency', 'POST', frequencyData);

export const updateFrequencyOption = async (id, frequencyData) => apiCallNoPage(`/v0/billing-frequency/${id}`, 'PUT', frequencyData);

export const deleteFrequencyOption = async (id) => apiCallNoPage(`/v0/billing-frequency/${id}`, 'DELETE');
