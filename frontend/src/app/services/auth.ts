import {api} from './api';
export type UserData = {
    email: string,
    password: string,
}

type ResponseLoginData = {id:number, email:string, role: string ,token: string};

export const authApi = api.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation<ResponseLoginData, UserData>({
            query: (userData) => ({
                url:'/user/login',
                method: 'POST',
                body: userData
            }) 
        }),
        register:builder.mutation<ResponseLoginData, UserData>({
            query: (userData) => ({
                url:'/user/register',
                method: 'POST',
                body: userData
            }) 
        })
    })
})

export const {useLoginMutation, useRegisterMutation} = authApi;

export const {endpoints: {login, register}} = authApi;