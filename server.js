import express from "express";
import TelegramBot from "node-telegram-bot-api";
import cors from "cors";
import { botToken } from "./config/config.js";
import { Commands } from "./commands/commands.js";
import connectToDb from "./db/db.js";
import User from "./models/User.js";
connectToDb();
const app = express();
const PORT = process.env.PORT || 1000;
app.use(cors());
export const bot = new TelegramBot(botToken, { polling: true });
Commands()

app.listen(PORT, () => console.log(`Server is listening to PORT ${PORT}`));
