import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from '../types/authTypes';

const authUser = JSON.parse(localStorage.getItem('authUser'));

const initialState = authUser
    ? { isLoggedIn: true, isSuccess: false, authUser }
    : { isLoggedIn: false, isSuccess: false, authUser: null };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                isSuccess: true,
            };
        case REGISTER_FAIL:
            console.log('fail');
            return {
                ...state,
                isLoggedIn: false,
                isSuccess: false,
            };

        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                authUser: payload.authUser,
            };

        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                authUser: null,
            };

        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                authUser: null,
            };

        default:
            return state;
    }
}
