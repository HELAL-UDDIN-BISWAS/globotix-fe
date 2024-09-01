// api.js
import Axios from "axios";
import Cookies from "js-cookie";

let url = process.env.NEXT_PUBLIC_CUS_API_URL;

// console.log("env url : " + process.env.NEXT_PUBLIC_API_URL);
// console.log("url : " + url);

const api = Axios.create({
  baseURL: url,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-access-token": Cookies.get("accessToken")
      ? Cookies.get("accessToken")
      : "",
    Authorization: "X-API-KEY 28f0fbb4-1fea-4227-a29b-d2d0c188d2cc",
  },
});

export default api;
