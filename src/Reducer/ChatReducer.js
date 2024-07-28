import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../API/AxiosInstance";

export const Chatadd = createAsyncThunk("chat/add", async (data) => {
  const response = await AxiosInstance.post("chat/add", data);
  return response.data;
});

export const Chatrecent = createAsyncThunk("chat/recentchat", async (data) => {
  const response = await AxiosInstance.get(`chat/recentchat?username=${data}`);
  return response.data;
});

export const Chatlist = createAsyncThunk("chat/list", async (data) => {
  const response = await AxiosInstance.get(`chat/list?username=${data}`);
  return response.data;
});

export const Chatdelete = createAsyncThunk("chat/delete", async (data) => {
  const response = await AxiosInstance.delete(`chat/delete?id=${data}`);
  return response.data;
});

export const generateTextThunk = createAsyncThunk("chat/generateText", async (newMessage) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk-proj-cXz1m60xX5MC1Z4P4aBVT3BlbkFJtkbHuQvXHjS3av1pLwZC",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: "(hãy trả lời các câu hỏi bằng tiếng việt)" + newMessage,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices[0].message.content;
      return answer;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
});

export const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    ChatData: {},
    ChatStatus: "idle",
    ChatrecentData: {},
    ChatrecentStatus: "idle",
    ChatlistData: {},
    ChatlistStatus: "idle",
    GeneratedTextData: {},
    GeneratedTextStatus: "idle",
    ChatdeleteData: {},
    ChatdeleteStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Chatadd.pending, (state, action) => {
        state.ChatStatus = "loading";
      })
      .addCase(Chatadd.fulfilled, (state, action) => {
        state.ChatStatus = "succeeded";
        state.ChatData = action.payload;
      })
      .addCase(Chatadd.rejected, (state, action) => {
        state.ChatStatus = "failed";
        console.log(action.error.message);
      })
      .addCase(Chatrecent.pending, (state, action) => {
        state.ChatrecentStatus = "loading";
      })
      .addCase(Chatrecent.fulfilled, (state, action) => {
        state.ChatrecentStatus = "succeeded";
        state.ChatrecentData = action.payload;
      })
      .addCase(Chatrecent.rejected, (state, action) => {
        state.ChatrecentStatus = "failed";
        console.log(action.error.message);
      })
      .addCase(Chatlist.pending, (state, action) => {
        state.ChatlistStatus = "loading";
      })
      .addCase(Chatlist.fulfilled, (state, action) => {
        state.ChatlistStatus = "succeeded";
        state.ChatlistData = action.payload;
      })
      .addCase(Chatlist.rejected, (state, action) => {
        state.ChatlistStatus = "failed";
        console.log(action.error.message);
      })
      .addCase(generateTextThunk.pending, (state, action) => {
        state.GeneratedTextStatus = "loading";
      })
      .addCase(generateTextThunk.fulfilled, (state, action) => {
        state.GeneratedTextStatus = "succeeded";
        state.GeneratedTextData = action.payload;
      })
      .addCase(generateTextThunk.rejected, (state, action) => {
        state.GeneratedTextStatus = "failed";
        console.log(action.error.message);
      })
      .addCase(Chatdelete.pending, (state, action) => {
        state.ChatdeleteStatus = "loading";
      })
      .addCase(Chatdelete.fulfilled, (state, action) => {
        state.ChatdeleteStatus = "succeeded";
        state.ChatData = action.payload;
      })
      .addCase(Chatdelete.rejected, (state, action) => {
        state.ChatdeleteStatus = "failed";
        console.log(action.error.message);
      });
  },
});

export default ChatSlice.reducer;
