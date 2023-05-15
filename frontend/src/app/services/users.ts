import {api} from './api';

export type User = {
    email: string,
    firstname: string,
    lastname: string,
    img_name?: string
}

export const usersApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getUserData: builder.query<User, void>({
            query: () => ({
                url:`/user`,
                method: "GET"
            })
        }),
        removeUser: builder.mutation<string, void>({
            query: () => ({
                url:`/user/delete`,
                method: "POST"
            })
        }),
        changePassword: builder.mutation<string, {password: string}>({
            query: (data) => ({
                url:`/user/changePassword`,
                method: "POST",
                body: data
            })
        }),
        editUser: builder.mutation<string, User>({
            query: (user) => ({
                url:`/user/update`,
                method: "POST",
                body: user
            })
        }),
    })
})


export const { 
    useChangePasswordMutation,
    useEditUserMutation,
    useGetUserDataQuery,
    useRemoveUserMutation
    // useRemoveTicketMutation,
    // useGetTicketQuery
 } = usersApi;

export const {endpoints: {getUserData, removeUser, editUser, changePassword}} = usersApi;