import { type } from 'os';
import {api} from './api';
export type Theater = {
    theater_id: string,
    name: string,
    description: string,
    address: string,
    img_name?: string | undefined;
    img: any
}

export type Actor = {
    actors_id: string,
    firstname: string,
    lastname: string,
    description: string,
    birth_date: string,
    img_name?: string,
    theater_id: string
}

export const theaterApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getAllTheaters: builder.query<Theater[], void>({
            query: () => ({
                url:"/theaters",
                method: "GET"
            })
        }),
        getTheater: builder.query<Theater, string>({
            query: (id) => ({
                url:`/theaters/${id}`,
                method: "GET"
            })
        }),
        editTheater: builder.mutation<string, Theater>({
            query: (theater) => ({
                url:`/theaters/update`,
                method: "POST",
                body: theater
            })
        }),
        removeTheater: builder.mutation<string, string>({
            query: (id) => ({
                url:`/theaters/delete/${id}`,
                method: "POST"
            })
        }),
        addTheater: builder.mutation<Theater, Theater>({
            query: (theater) => ({
                url:`/theaters/add`,
                method: "POST",
                body: theater
            })
        }),
        addArea: builder.mutation<string, {num:string, capacity:string, theater_id: string}>({
            query: (area) => ({
                url:`/theaters/addArea/${area.theater_id}`,
                method: "POST",
                body: area
            })
        }),
        getActors: builder.query<Actor[], string>({
            query: (id) => ({
                url:`/theaters/actors/${id}`,
                method: "GET"
            })
        }),
        getTheatersWithAreas: builder.query<{name:string, areas: string}[],void>({
            query: () => ({
                url:`/theaters/withAreas`,
                method: "GET"
            })
        }),
    })
})


export const { 
    useGetAllTheatersQuery, 
    useGetTheaterQuery, 
    useAddTheaterMutation, 
    useEditTheaterMutation, 
    useRemoveTheaterMutation,
    useGetActorsQuery,
    useGetTheatersWithAreasQuery,
    useAddAreaMutation
 } = theaterApi;

export const {endpoints: {getAllTheaters, getTheater, addTheater, removeTheater, editTheater, getActors, getTheatersWithAreas, addArea}} = theaterApi;