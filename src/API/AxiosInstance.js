import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = process.env.EXPO_PUBLIC_API_URL;
const AxiosInstance = axios.create({
  baseURL: apiKey,
  responseType: "json",
});

export default AxiosInstance;
