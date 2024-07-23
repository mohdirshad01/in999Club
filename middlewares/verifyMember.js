import Channel from "../models/Channel.js";
import { bot } from "../server.js";

export async function VerifyUser(msg){
    try{
        const chatId = msg.message.chat.id;
        let channelsDoc = await Channel.findOne({});
        let channels = channelsDoc ? channelsDoc.channels : [];
        let isMemberOfAllChannels ;
        for (const channel of channels) {
            try {
                const chatMember = await bot.getChatMember(channel.chatId, chatId);
                if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                    isMemberOfAllChannels = false;
                }else{
                    isMemberOfAllChannels = true;
                }
            } catch (error) {
                console.error(`Error checking membership for channel ${channel}:`, error);
                isMemberOfAllChannels = false;
            }
        }
        if (!isMemberOfAllChannels){
            const channelsDoc = await Channel.findOne({});
            if (!channelsDoc) {
                throw new Error('No channel document found.');
            }

            const channels = channelsDoc.channels || [];

            // Generate the inline keyboard buttons
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
            let welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
            bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
            
        }
        const startKeyBoardOpts = {
            reply_markup: {
                keyboard: [
                    ['Prediction', 'Fund Management'],
                    ['₹50000 Gift Code', 'Free Deposit Bonus']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
            parse_mode: "HTML"
        };
        const welcomeMessage = "<b>Welcome! You have joined all required channels.</b>";
        bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
    }
    catch(error){
        console.log(error)
    }
}