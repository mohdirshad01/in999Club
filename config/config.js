export const dbUrl = "mongodb+srv://botsbazaar:SqeIfowwk7xwcmoE@botsbazaar.sjj4mn8.mongodb.net/?retryWrites=true&w=majority&appName=botsbazaar";
export const botToken = "6580112130:AAEPpOjNr4jFVOc-0vPjVYU8QlGoKI5jdak";
export const admins = [6966849450, 5547959277]
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
