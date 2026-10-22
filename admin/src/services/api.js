import axios from "axios";

const API = axios.create({
  baseURL: "https://foodnest-ip5s.onrender.com/api",
});

export default API;