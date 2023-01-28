import { config } from "dotenv";
config();
import { connectToDb } from "./config/dbConfig";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from './routes';

connectToDb();

const app = express();
const PORT = process.env.port || 8080;

app.use(cors(), express.json(), cookieParser());
app.use(router);

app.listen(PORT, () => console.log(`Server is running on: ${PORT}`));