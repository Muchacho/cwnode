import {api} from './api';
import { Actor } from './theaters';

export const actorsApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getActor: builder.query<Actor, string>({
            query: (id) => ({
                url:`/theaters/actor/${id}`,
                method: "GET"
            })
        }),
        removeActor: builder.mutation<string, string>({
            query: (id) => ({
                url:`/theaters/delActor/${id}`,
                method: "POST"
            })
        }),
        addActor: builder.mutation<string, Actor>({
            query: (actor) => ({
                url:`/theaters/addActor/${actor.theater_id}`,
                method: "POST",
                body: actor
            })
        }),
        editActor: builder.mutation<string, Actor>({
            query: (actor) => ({
                url:`/theaters/updActor/${actor.theater_id}`,
                method: "POST",
                body: actor
            })
        }),
    })
})


export const { 
    useGetActorQuery,
    useRemoveActorMutation,
    useAddActorMutation,
    useEditActorMutation
    // useRemoveTicketMutation,
    // useGetTicketQuery
 } = actorsApi;

export const {endpoints: {getActor, removeActor, addActor, editActor}} = actorsApi;