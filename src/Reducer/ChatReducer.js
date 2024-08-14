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

const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export const generateTextThunk = createAsyncThunk("chat/generateText", async (data) => {
  try {
    // Thêm tin nhắn của người dùng vào lịch sử
    const chatHistory = [
      ...data.messages,
      {
        role: "user",
        content:
          data.url && data.url.length > 0
            ? [
                {
                  type: "text",
                  text: "Xem hình và trả lời câu hỏi" + data.newMessage,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: data.url,
                  },
                },
              ]
            : data.newMessage,
      },
    ];
    console.log(data);
    console.log(chatHistory[0]);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: chatHistory,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices[0].message.content;
      // Thêm phản hồi của chatbot vào lịch sử
      chatHistory.push({
        role: "assistant",
        content: answer,
      });
      
      console.log("chatHistory" + chatHistory);
      return answer;
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.log(error);
  }
});

export const Uploadimg = createAsyncThunk("chat/upimg", async (image) => {
  const imageUri = image.uri;
  const fileName = imageUri.split("/").pop();
  const fileType = image.mimeType;

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: fileType,
    name: fileName,
  });
  formData.append("upload_preset", "woedj14o"); // specify the name of your upload preset
  formData.append("api_key", "587196265671728"); // replace with your API key
  formData.append("timestamp", Date.now() / 1000); // current timestamp
  formData.append("folder", "Imgdata");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/djywo5wza/image/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      const url = data.secure_url;
      console.log(url);
      return url;
    }
  } catch (error) {
    console.log(error);
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
    UploadimgData: {},
    UploadimgStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Chatadd.pending, (state, action) => {
        state.ChatStatus = "loading";
        console.log("Chat status: loading");
      })
      .addCase(Chatadd.fulfilled, (state, action) => {
        state.ChatStatus = "succeeded";
        state.ChatData = action.payload;
        console.log("Chat status: succeeded");
      })
      .addCase(Chatadd.rejected, (state, action) => {
        state.ChatStatus = "failed";
        console.log("Chat status: failed", action.error.message);
      })
      .addCase(Chatrecent.pending, (state, action) => {
        state.ChatrecentStatus = "loading";
        console.log("ChatrecentStatus: loading");
      })
      .addCase(Chatrecent.fulfilled, (state, action) => {
        state.ChatrecentStatus = "succeeded";
        state.ChatrecentData = action.payload;
        console.log("ChatrecentStatus: succeeded");
      })
      .addCase(Chatrecent.rejected, (state, action) => {
        state.ChatrecentStatus = "failed";
        console.log(action.error.message);
        console.log("ChatrecentStatus: failed");
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
        console.log("GeneratedTextStatus: loading");
      })
      .addCase(generateTextThunk.fulfilled, (state, action) => {
        state.GeneratedTextStatus = "succeeded";
        state.GeneratedTextData = action.payload;
        console.log("GeneratedTextStatus: succeeded");
      })
      .addCase(generateTextThunk.rejected, (state, action) => {
        state.GeneratedTextStatus = "failed";
        console.log(action.error.message);
        console.log("GeneratedTextStatus: failed");
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
      })
      .addCase(Uploadimg.pending, (state, action) => {
        state.UploadimgStatus = "loading";
      })
      .addCase(Uploadimg.fulfilled, (state, action) => {
        state.UploadimgStatus = "succeeded";
        state.UploadimgData = action.payload;
      })
      .addCase(Uploadimg.rejected, (state, action) => {
        state.UploadimgStatus = "failed";
        console.log(action.error.message);
      });
  },
});

export default ChatSlice.reducer;
