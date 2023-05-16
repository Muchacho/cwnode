import {api} from './api';

export type Show = {
    show_id: string,
    name: string,
    description: string,
    duration: string,
    rating?: string,
    img?: any,
    img_name?: string | undefined;
}

export type FullShowInfo = {
    show : Show,
    schedule : {
        schedule_id: string,
        price: string,
        start_time: string,
        name:string
    }[],
}

export type CommentData = {
    show_id: string,
    email: string,
    rating: string,
    comment: string
}

export const showApi = api.injectEndpoints({
    endpoints:(builder) => ({
        getAllShows: builder.query<Show[], void>({
            query: () => ({
                url:"/shows",
                method: "GET"
            })
        }),
        getShow: builder.query<FullShowInfo, string>({
            query: (id) => ({
                url:`/shows/${id}`,
                method: "GET"
            })
        }),
        editShow: builder.mutation<string, Show>({
            query: (show) => ({
                url:`/shows/update/${show.show_id}`,
                method: "POST",
                body: show
            })
        }),
        removeShow: builder.mutation<string, string>({
            query: (id) => ({
                url:`/shows/delete/${id}`,
                method: "POST"
            })
        }),
        addShow: builder.mutation<Show, FormData>({
            query: (show) => ({
                url:`/shows/add`,
                method: "POST",
                body: show
            })
        }),
        getComments: builder.query<CommentData[], string>({
            query: (id) => ({
                url:`/shows/comments/${id}`,
                method: "GET"
            })
        }),
        addComment: builder.mutation<string, CommentData>({
            query: (comment) => ({
                url:`/shows/comment/${comment.show_id}`,
                method: "POST",
                body: comment
            })
        })
    })
})


export const { 
   useGetAllShowsQuery,
   useGetShowQuery,
   useEditShowMutation,
   useRemoveShowMutation,
   useAddShowMutation,
   useAddCommentMutation,
   useGetCommentsQuery
 } = showApi;

export const {endpoints: {getAllShows, getShow, addShow, removeShow, editShow, getComments, addComment}} = showApi;