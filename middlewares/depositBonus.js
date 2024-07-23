import { bot } from "../server.js";
import Link from "../models/Link.js";
import Channel from "../models/Channel.js";
export async function depositBonus(msg){
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
        const checkLink = await Link.findOne({});

        if (!checkLink || !checkLink.link) {
            throw new Error('No link found in the database.');
        }

        const storedLink = checkLink.link;
        const giftText = "<b>✅ Sikkim Highest Double Deposit Bonus Offer !! 🔥\n\n🔸Deposit ₹100 & Get Extra ₹68\n\n🔸Deposit ₹300 & Get Extra ₹138\n\n🔸Deposit ₹1200 & Get Extra ₹328\n\n🔸Deposit ₹5000 & Get Extra ₹1088\n\n👉Minimum Withdrawal ₹110\n\n🔗 Register Here:: "+storedLink+"\n\n❤️ Payment Fully Verified !! 🫦🔥</b>";
        const giftImage = "https://i.ibb.co/JKNvwNq/deposit.jpg";
        await bot.sendPhoto(chatId, giftImage, {
            caption: giftText,
            parse_mode: "HTML"
        });
    }
    catch(error){
        console.log(error)
    }
}