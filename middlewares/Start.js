import { bot } from "../server.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

export async function Start(msg) {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id; // Use userId for User model operations

        // Check if user exists and create a new one if not
        let checkUser = await User.findOne({ user_id: userId });
        if (!checkUser) {
            const newUser = new User({
                user_id: userId,
                isJoined: false
            });
            await newUser.save();
        }

        // Fetch channels from the database
        const channelsDoc = await Channel.findOne({});
        const channels = channelsDoc ? channelsDoc.channels : [];

        // Check user's membership in each channel
        let isMemberOfAllChannels = true;
        for (const channel of channels) {
            try {
                const chatMember = await bot.getChatMember(channel.chatId, userId);
                console.log(chatMember.status);
                if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                    isMemberOfAllChannels = false;
                    break;
                }
            } catch (error) {
                console.error(`Error checking membership for channel ${channel.chatId}:`, error);
                isMemberOfAllChannels = false;
                break;
            }
        }

        // Generate keyboard options directly
        let startKeyBoardOpts;
        if (isMemberOfAllChannels) {
            startKeyBoardOpts = {
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
        } else {
            // Generate the inline keyboard for channels
            const channelButtons = [];
            for (let i = 0; i < channels.length; i += 2) {
                const row = [];
                const firstChannel = channels[i];
                const secondChannel = channels[i + 1] || null;

                if (firstChannel) {
                    row.push({ text: '📢 Join', url: firstChannel.link });
                }
                if (secondChannel) {
                    row.push({ text: '📢 Join', url: secondChannel.link });
                }
                channelButtons.push(row);
            }

            startKeyBoardOpts = {
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
        }

        // Welcome message
        const welcomeMessage = isMemberOfAllChannels
            ? `<b>👋Hey ${msg.chat.first_name} Welcome To Our Premium Prediction Bot!\n\nPlease select the Option Below</b>`
            : "<b>🛑 Must Join Total Channel To Use Our Bot</b>";

        // Send welcome message
        try {
            await bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
            console.log('Welcome message sent successfully');
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    } catch (error) {
        console.error("Error in Start function:", error);
    }
}
