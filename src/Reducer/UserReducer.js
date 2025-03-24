import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../API/AxiosInstance";
import { Alert } from "react-native";
import { Translate } from "../Translate";

export const Reg = createAsyncThunk("user/reg", async (data) => {
  const response = await AxiosInstance.post("user/reg", data);
  return response.data;
});

export const Log = createAsyncThunk("user/login", async (data) => {
  const response = await AxiosInstance.post("user/login", data);
  return response.data;
});

export const Connect = createAsyncThunk("user/connect", async (data) => {
  const response = await AxiosInstance.get("user/connect", data);
  return response.data;
});

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    RegData: {},
    RegStatus: "idle",
    LoginData: {},
    LoginStatus: "idle",
    ConnectStatus: "idle",
    ConnectData: {},
    Theme: false,
  },
  reducers: {
    setThemme(state, action) {
      state.Theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Reg.pending, (state, action) => {
        state.RegStatus = "loading";
      })
      .addCase(Reg.fulfilled, (state, action) => {
        state.RegStatus = "succeeded";
        state.RegData = action.payload;
      })
      .addCase(Reg.rejected, (state, action) => {
        state.RegStatus = "failed";
        console.log(action.error.message);
      })
      .addCase(Log.pending, (state, action) => {
        state.LoginStatus = "loading";
      })
      .addCase(Log.fulfilled, (state, action) => {
        state.LoginStatus = "succeeded";
        state.LoginData = action.payload;
      })
      .addCase(Log.rejected, (state, action) => {
        state.LoginStatus = "failed";
        if (action.error.message.includes("401")) {
          Alert.alert(
            Translate("notice"),
            Translate("incorrectlogininformation")
          );
        }
        console.log(action.error.code);
      })
      .addCase(Connect.pending, (state, action) => {
        state.ConnectStatus = "loading";
      })
      .addCase(Connect.fulfilled, (state, action) => {
        state.ConnectStatus = "succeeded";
        state.ConnectData = action.payload;
      })
      .addCase(Connect.rejected, (state, action) => {
        state.ConnectStatus = "failed";
        console.log(action.error.message);
      });
  },
});

export const { setThemme } = UserSlice.actions;
export default UserSlice.reducer;
