import axios from "axios";
// const BASE_URL = "http://localhost:8000";
const BASE_URL = "http://ec2-65-2-128-166.ap-south-1.compute.amazonaws.com";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
