import axios from "axios";
import dotenv from "dotenv";
import { Schema } from "mongoose";

dotenv.config();
const API_URL = process.env.API_SERVER;

export const writeOKAY = (id: Schema.Types.ObjectId | string) =>
  axios.get(`${API_URL}/okay/${id}`);
