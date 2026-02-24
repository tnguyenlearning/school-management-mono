import axios from 'axios';
import authHeader from '../services/authHeader';
import { baseURL } from '../configs/urls';

const request = axios.create({
    baseURL,
    headers: authHeader(),
});

export default request;
