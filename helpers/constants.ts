import axios from "axios";

const FRONTEND_API = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api`
  : "http://localhost:3000/api";

const feInstance = axios.create({
  baseURL: FRONTEND_API,
});

export { FRONTEND_API, feInstance as nextApi };
