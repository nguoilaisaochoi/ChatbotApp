import axios from "axios";
import {API_URL_1} from "@env";

const AxiosInstance = axios.create({
  baseURL: API_URL_1,
  responseType: "json",
});

export default AxiosInstance;
