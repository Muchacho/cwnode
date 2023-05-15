import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../app/services/auth";
import { RootState } from "../../app/store";

interface InitialState{
    user: {id:number, email:string, role: string ,token: string} | null,
    inAuthenticated: boolean;
}

const initialState: InitialState = {
    user:null,
    inAuthenticated: false,
}

const slice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        logout: ()=> initialState,
    },
    extraReducers: (builder)=>{
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action)=>{
            state.user = action.payload;
            state.inAuthenticated = true;
        })
        .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action)=>{
            state.user = action.payload;
            state.inAuthenticated = true;
        })
    }
})

export const {logout} = slice.actions;
export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.inAuthenticated;

export const selectUser = (state: RootState) => state.auth.user;