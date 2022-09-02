import axios from "axios";

export const stripchatApi = axios.create({
  baseURL:
    "https://stripchat.com/api/stats/v2/studios/username/strip-ken/models/username",
  headers: {
    "API-Key": process.env.STRIPCHAT_API_SECRET || "",
    accept: "application/json",
  },
});
