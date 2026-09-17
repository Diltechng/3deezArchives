import { env } from "@/lib/env";
import axios from "axios";

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});