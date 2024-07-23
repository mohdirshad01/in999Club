if (checkUser) {
    if (!checkUser[0].isJoined) {
        welcomeMessage = "<b>User Already Started the bot</b>";
        bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
    } else {
        welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
        bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
    }
} else {
    welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
    bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
    const newUser = new User({
        user_id: chatId,
        isJoined: false
    });
    await newUser.save();
}