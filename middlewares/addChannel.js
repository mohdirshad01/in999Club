import Channel from "../models/Channel.js";
import { bot } from "../server.js";
import { admins } from "../config/config.js";

export const askForChannelAndSave = async (msg) => {
    const chatId = msg.message.chat.id;
    if (!admins.includes(chatId)) {
        bot.sendMessage(msg.from.id, "You are not authorized");
        return;
    }

    try {
        // Ask for channel chat ID
        await bot.sendMessage(chatId, 'Please enter the channel chat ID:');
        const chatIdResponse = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg.text);
            });
        });
        const channelChatId = chatIdResponse.trim();

        // Ask for channel link
        await bot.sendMessage(chatId, 'Please enter the channel link:');
        const linkResponse = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg.text);
            });
        });
        const channelLink = linkResponse.trim();

        // Create channel object
        const channelToAdd = {
            chatId: channelChatId,
            link: channelLink
        };

        // Check if channel already exists
        const existingChannel = await Channel.findOne({ channels: { $elemMatch: { chatId: channelChatId } } });
        if (existingChannel) {
            await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} already exists.`);
            return existingChannel;
        } else {
            let channelDocument = await Channel.findOne();
            if (!channelDocument) {
                channelDocument = new Channel({
                    channels: [channelToAdd]
                });
            } else {
                channelDocument.channels.push(channelToAdd);
            }
            await channelDocument.save();
            console.log('Channel added successfully:', channelToAdd);
            await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} added successfully.`);
            return channelDocument;
        }
    } catch (error) {
        console.error('Error adding channel:', error.message);
        throw error; // Rethrow the error to be handled elsewhere
    }
};
