import { createSlice } from "@reduxjs/toolkit";
import { Show, showApi } from "../../app/services/shows";
import { RootState } from "../../app/store";

interface InitialState{
    shows: Show[] | null
}

const initialState: InitialState = {
    shows: null,
}

const slice = createSlice({
    name: "shows",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) =>{
        builder
            .addMatcher(showApi.endpoints.getAllShows.matchFulfilled, (state, action)=>{
                state.shows = action.payload;
            })
    }
})

export default slice.reducer;
export const selectShows = (state: RootState) => state.shows;