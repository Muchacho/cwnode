import {createListenerMiddleware} from '@reduxjs/toolkit';
import { authApi } from '../app/services/auth';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners();
        if(action.payload.token){
            localStorage.setItem('token', action.payload.token);
        }
        if(action.payload.email && action.payload.id && action.payload.role){
            localStorage.setItem('user', {email: action.payload.email, id: action.payload.id, role: action.payload.role}.toString())
        }

    }
})