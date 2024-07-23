import { bot } from "../server.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

const userSessions = new Map(); // This will store user sessions

// Function to handle the user registration link
export async function giftCode(msg) {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id; // Telegram user ID
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
            await bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts)
            return
        }

        // Fetch the user's data
        const checkUser = await User.findOne({ user_id: userId });
        if (!checkUser) {
            throw new Error('User not found in the database.');
        }

        // Fetch the channel link
        const channelDoc = await Channel.findOne({});
        const firstChannel = channelDoc?.channels?.[0]?.link; // Get the first link if available

        if (!firstChannel) {
            throw new Error('Channel link not found in the database.');
        }

        if (checkUser.isJoined === true) {
            const giftText = `<b>😍 Gift Codes Coming For New Users !!👇\n\n😘 Unlimited GiftCode Link:: <a href='${firstChannel}'>(Click Here)</a>\n\n🤑 <a href='${firstChannel}'>Join Now</a> & Pin To Top For Back To Back Gift Codes Upto ₹50000!! 🔥🔥</b>`;
            const giftImage = "https://i.ibb.co/zrkBTQM/gift.jpg";
            await bot.sendPhoto(chatId, giftImage, {
                caption: giftText,
                parse_mode: "HTML"
            });
        } else {
            const chartText = "Hello " + msg.chat.first_name +"!!\n\nIn999 Official Link: https://in88.in/#/register?invitationCode=87221161402\n\n🔴 Other IDs Registered Under Another Links Will Not Get Gift Code / SureShots So Must Register Under Official Link\n\n👉 Must Add Bank Account To Get Gift Code If You Not Add Bank You Will Not Get Gift Codes 🤫🚀\n\nRegister From This Official Link & Send Me In999 UID.😍👇";
            const chartKeyBoardOpts = {
                reply_markup: {
                    keyboard: [
                        ['Cancel'],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            };
            const photo = 'https://i.ibb.co/30vFhRD/member.jpg';
            await bot.sendPhoto(chatId, photo, {
                caption: chartText,
                parse_mode: "HTML",
                ...chartKeyBoardOpts
            });

            // Store the user session to handle responses
            userSessions.set(userId, { chatId, awaitingCode: true });

            // Handle user responses
            bot.on('message', async (message) => {
                const responseChatId = message.chat.id;
                const responseText = message.text.trim();
                const responseUserId = message.from.id;

                if (userSessions.has(responseUserId)) {
                    const session = userSessions.get(responseUserId);

                    // Ensure the message is from the same user who requested the gift code
                    if (responseChatId === session.chatId) {
                        if (session.awaitingCode) {
                            if (/^\d{6}$/.test(responseText)) { // Check if the response is a 6-digit number
                                await User.updateOne({ user_id: responseUserId }, { isJoined: true });
                                const updatedText = "<b>Your registration is complete. You will receive gift codes soon!</b>";
                                await bot.sendMessage(responseChatId, updatedText, { parse_mode: "HTML" });
                                userSessions.delete(responseUserId); // End the session
                            } else if (responseText.toLowerCase() === 'cancel') {
                                await bot.sendMessage(responseChatId, "<b>Operation canceled.</b>", { parse_mode: "HTML" });
                                userSessions.delete(responseUserId); // End the session
                            } else {
                                await bot.sendMessage(responseChatId, "<b>❌ Invalid code. Please send a 6-digit number.</b>", { parse_mode: "HTML" });
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in giftCode function:', error);
    }
}
