import { createSlice } from "@reduxjs/toolkit";
import { Theater, theaterApi } from "../../app/services/theaters";
import { RootState } from "../../app/store";

interface InitialState{
    theaters: Theater[] | null
}

const initialState: InitialState = {
    theaters: null,
}

const slice = createSlice({
    name: "theaters",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) =>{
        builder
            .addMatcher(theaterApi.endpoints.getAllTheaters.matchFulfilled, (state, action)=>{
                state.theaters = action.payload;
            })
    }
})

export default slice.reducer;
export const selectTheaters = (state: RootState) => state.theaters;