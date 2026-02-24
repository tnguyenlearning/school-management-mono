import { apiCallNoPage } from '../apiService';
import { getFrequencyOptionById } from './frequencyApis';

export const getAllowedFrequencyByCourseId = async (courseId) => {
    const { response, errorMessage } = await apiCallNoPage(`/v0/course-allowed-frequency/search/findByCourseId?courseId=${courseId}`);
    if (errorMessage) {
        return { response: null, errorMessage };
    }

    if (response.length === 0) {
        return { response: [], errorMessage: 'No Frequency option found with the given courseId.' };
    }

    const frequencies = [];
    for (const freq of response) {
        const { response: freqResponse, errorMessage: freqError } = await getFrequencyOptionById(freq.billingFrequencyOptionId);
        if (freqError) {
            return { response: null, errorMessage: freqError };
        }
        frequencies.push(freqResponse);
    }

    return { response: frequencies, errorMessage };
};
