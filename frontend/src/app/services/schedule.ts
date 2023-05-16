import {api} from './api';
import { Ticket } from './cart';

// export type Show = {
//     show_id: string,
//     name: string,
//     description: string,
//     duration: string,
//     rating?: string,
//     image_name?: string | undefined;
// }

// export type FullShowInfo = {
//     show : Show,
//     schedule : {
//         schedule_id: string,
//         price: string,
//         start_time: string,
//         name:string
//     }[],
// }

export type ScheduleData = {
    schedule_id: string,
    show_id: string,
    name: string,
    theater_id: string,
    theater?: string,
    area?:string,
    start_time: string,
    price: string
}

export type ScheduleItemData = {
        schedule_id: string,
        time: string,
        name: string,
        capacity: number
}

export const scheduleApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getSchedule: builder.query<ScheduleData[], void>({
            query: () => ({
                url:"/schedule",
                method: "GET"
            })
        }),
        getScheduleItem: builder.query<ScheduleItemData, string>({
            query: (id) => ({
                url:`/schedule/${id}`,
                method: "GET"
            })
        }),
        editScheduleItem: builder.mutation<string, ScheduleData>({
            query: (schedule) => ({
                url:`/schedule/update/${schedule.schedule_id}`,
                method: "POST",
                body: schedule
            })
        }),
        removeScheduleItem: builder.mutation<string, string>({
            query: (id) => ({
                url:`/schedule/delete/${id}`,
                method: "POST"
            })
        }),
        addScheduleItem: builder.mutation<ScheduleData, ScheduleData>({
            query: (schedule) => ({
                url:`/schedule/add`,
                method: "POST",
                body: schedule
            })
        }),
        getBookedTickets: builder.query<Ticket[], string>({
            query: (id) => ({
                url:`/schedule/getTickets/${id}`,
                method: "GET",
            })
        }),
        bookTicket: builder.mutation<string, {schedule_id:string, place:string}>({
            query: (ticket) => ({
                url:`/schedule/bookTicket`,
                method: "POST",
                body: ticket
            })
        }),
    })
})


export const { 
    useGetScheduleQuery,
    useGetScheduleItemQuery,
    useAddScheduleItemMutation,
    useRemoveScheduleItemMutation,
    useEditScheduleItemMutation,
    useBookTicketMutation,
    useGetBookedTicketsQuery
 } = scheduleApi;

export const {endpoints: {getSchedule, getScheduleItem, addScheduleItem, removeScheduleItem, editScheduleItem, bookTicket, getBookedTickets}} = scheduleApi;