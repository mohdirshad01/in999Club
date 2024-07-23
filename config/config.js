export const dbUrl = "mongodb+srv://sikkim:sikkim123@botcluester.azzl5zt.mongodb.net/?retryWrites=true&w=majority&appName=botcluester";
export const botToken = "7234886877:AAGlCrTWEHuocAtMetQIi3V3w0h08TerFeo";
export const admins = [7187833392, 5547959277]
export const channels = ["zaker_channel_001", "zaker_channel_002"]
export const cancelKeyboard = {
    reply_markup: {
        keyboard: [
            ['Cancel'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    },
    parse_mode: "HTML"
};
export const predictionKeyboard = {
    reply_markup: {
        keyboard: [
            ['Get Prediction', 'Result'],
            ['Register Link', '🔙Back']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    },
    parse_mode: "HTML"
};