import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from '../types/authTypes';
import { SET_MESSAGE } from '../types/messageType';

import urls from '~/common/configs/urls';
import { apiCallNoPage } from '~/common/services/apiService';

export const register = (userInfo) => async (dispatch) => {
    try {
        const response = await apiCallNoPage(urls.register, 'POST', userInfo);
        console.log('dispatch');
        dispatch({
            type: REGISTER_SUCCESS,
            payload: { user: userInfo },
        });

        dispatch({
            type: SET_MESSAGE,
            payload: 'Register is Successful!',
        });
        return response;
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: error.message,
        });
        throw error;
    }
};

export const login = (loginData) => async (dispatch) => {
    try {
        const response = await apiCallNoPage(urls.logIn, 'POST', loginData);
        localStorage.setItem('authUser', JSON.stringify(response));

        dispatch({
            type: LOGIN_SUCCESS,
            payload: { authUser: response },
        });
        return response;
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
        });
        throw error;
    }
};

export const logout = () => async (dispatch) => {
    try {
        const response = await apiCallNoPage(urls.logOut, 'POST');
        dispatch({
            type: LOGOUT,
        });
        return response;
    } catch (error) {}
};
