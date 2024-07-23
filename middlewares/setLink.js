import { bot } from "../server.js";
import { admins, cancelKeyboard } from "../config/config.js";
import Link from "../models/Link.js";
export async function setLink(msg) {
    try {
        const chatId = msg.message.chat.id;
        if (!admins.includes(chatId)) {
            bot.sendMessage(msg.from.id, "You are not authorized");
            return;
        }
        await bot.sendMessage(chatId, 'Please enter the Referral Link:', cancelKeyboard);
        const setLinkResponse = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg.text);
            });
        });
        const refLink = setLinkResponse.trim();
        if (refLink !== "Cancel") {
            await Link.findOneAndUpdate(
                {},
                { link: refLink },
                { upsert: true, new: true }
            );
            await bot.sendMessage(chatId, "The referral link has been updated successfully.");
        }
    } catch (error) {
        console.log(error);
        await bot.sendMessage(chatId, "An error occurred while updating the referral link.");
    }
}