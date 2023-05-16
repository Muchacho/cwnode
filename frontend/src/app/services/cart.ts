import {api} from './api';
export type Ticket = {
    ticket_id: string,
    name: string,
    schedule_id: string,
    show_id: string,
    price: string,
    place: string,
    time: string,
    address: string,
    theater_name: string
}

export type ScheduleItemData = {
        schedule_id: string,
        time: string,
        name: string,
        capacity: number
}

export const cartApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getCart: builder.query<Ticket[], void>({
            query: () => ({
                url:"/user/cart",
                method: "GET"
            })
        }),
        getTicket: builder.query<Ticket, string>({
            query: (id) => ({
                url:`/user/ticket/${id}`,
                method: "GET"
            })
        }),
        // getScheduleItem: builder.query<ScheduleItemData, string>({
        //     query: (id) => ({
        //         url:`/schedule/${id}`,
        //         method: "GET"
        //     })
        // }),
        // editScheduleItem: builder.mutation<string, ScheduleData>({
        //     query: (schedule) => ({
        //         url:`/schedule/update/${schedule.schedule_id}`,
        //         method: "POST",
        //         body: schedule
        //     })
        // }),
        removeTicket: builder.mutation<string, string>({
            query: (id) => ({
                url:`/user/unbookedTicked/${id}`,
                method: "POST"
            })
        }),
        // addScheduleItem: builder.mutation<ScheduleData, ScheduleData>({
        //     query: (schedule) => ({
        //         url:`/schedule/add`,
        //         method: "POST",
        //         body: schedule
        //     })
        // }),
        // bookTicket: builder.mutation<ScheduleData, ScheduleData>({
        //     query: (schedule) => ({
        //         url:`/schedule/add`,
        //         method: "POST",
        //         body: schedule
        //     })
        // }),
    })
})


export const { 
    useGetCartQuery,
    useRemoveTicketMutation,
    useGetTicketQuery
    // useGetScheduleItemQuery,
    // useAddScheduleItemMutation,
    // useRemoveScheduleItemMutation,
    // useEditScheduleItemMutation
 } = cartApi;

export const {endpoints: {getCart, getTicket, removeTicket}} = cartApi;