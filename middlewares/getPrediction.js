import { bot } from "../server.js";
import { getPrediction } from "../utils/functions.js";
import Channel from "../models/Channel.js";

export async function getNewPrediction(msg){
    try{
        const chatId = msg.chat.id;
        const channelsDoc = await Channel.findOne({});

        if (!channelsDoc) {
            throw new Error('No channel document found.');
        }

        const channels = channelsDoc.channels || [];
        let isMemberOfAllChannels;

        for (const channel of channels) {
            try {
                const chatMember = await bot.getChatMember(channel.chatId, chatId);
                if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                    isMemberOfAllChannels = false;
                } else {
                    isMemberOfAllChannels = true
                }
            } catch (error) {
                console.error(`Error checking membership for channel ${channel.chatId}:`, error);
                isMemberOfAllChannels = false;
            }
        }

        if (!isMemberOfAllChannels) {
            const channelButtons = [];
            for (let i = 0; i < channels.length; i += 2) {
                const row = [];
                const firstChannel = channels[i];
                const secondChannel = channels[i + 1] || null;

                if (firstChannel && firstChannel.link) {
                    row.push({ text: '📢 Join', url: firstChannel.link });
                }
                if (secondChannel && secondChannel.link) {
                    row.push({ text: '📢 Join', url: secondChannel.link });
                }
                if (row.length > 0) {
                    channelButtons.push(row);
                }
            }

            const startKeyBoardOpts = {
                reply_markup: {
                    inline_keyboard: [
                        ...channelButtons,
                        [
                            { text: 'Verify', callback_data: 'check_join' }
                        ]
                    ]
                },
                parse_mode: 'HTML'
            };
            const welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
            await bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
            return
        }
        const fetchPred = await getPrediction();
        if(fetchPred.result == 'Big'){
            const predMes = "<b>WinGO 1 MIN\n\n🚀 Period - "+fetchPred.period+"\n\n🚀 Purchasing: "+fetchPred.result+"💸\n\nI Always Use 2X Plan, For 100 % Gurantee Of My Profits\n\nAlways Play Through Fund Management only 5 - Level</b>";
            const photo = 'https://i.ibb.co/Vq0L6DD/big.jpg';
            bot.sendPhoto(chatId, photo, {
                caption: predMes,
                parse_mode: "HTML"});
            await bot.sendSticker(chatId, "CAACAgUAAxkBAW8K_GaeMnxamezi5mmdJ4u7Ylbbj8F9AAJSAwAC0qoBVU3NipS4NOxCNQQ")
                return;
        }
        if (fetchPred.result == 'Small') {
            const predMes = "<b>WinGO 1 MIN\n\n🚀 Period - " + fetchPred.period + "\n\n🚀 Purchasing: " + fetchPred.result + "💸\n\nI Always Use 2X Plan, For 100 % Gurantee Of My Profits\n\nAlways Play Through Fund Management only 5 - Level</b>";
            const photo = 'https://i.ibb.co/v3zW2QS/small.jpg';
            bot.sendPhoto(chatId, photo, {
                caption: predMes,
                parse_mode: "HTML"
            });
            await bot.sendSticker(chatId, "CAACAgUAAxkBAW8K_GaeMnxamezi5mmdJ4u7Ylbbj8F9AAJSAwAC0qoBVU3NipS4NOxCNQQ")
            return;
            return;
        }
    }
    catch(error){
        console.log(error);
    }
}
