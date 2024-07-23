import { Start } from "../middlewares/Start.js";
import { bot } from "../server.js";
import { askForChannelAndSave } from "../middlewares/addChannel.js";
import { askForChannelAndRemove } from "../middlewares/removeChannel.js";
import { Admin } from "../middlewares/Admin.js";
import { VerifyUser } from "../middlewares/verifyMember.js";
import fundManagement from "../middlewares/fundManagement.js";
import { Back, Cancel } from "../middlewares/Cancel.js";
import { setLink } from "../middlewares/setLink.js";
import { Prediction } from "../middlewares/Prediction.js";
import { getNewPrediction } from "../middlewares/getPrediction.js";
import { getNewResult } from "../middlewares/getResult.js";
import { registerLink } from "../middlewares/registerLink.js";
import { giftCode } from "../middlewares/giftCode.js";
import { depositBonus } from "../middlewares/depositBonus.js";
import { Broadcast } from "../middlewares/Broadcast.js";

export async function Commands() {
    bot.onText(/\/start/, Start);
    bot.onText(/\/admin/, Admin);
    bot.onText(/Fund Management/,fundManagement);
    bot.onText(/Cancel/,Cancel);
    bot.onText(/🔙Back/,Back);
    bot.onText(/Prediction/,Prediction);
    bot.onText(/Get Prediction/,getNewPrediction);
    bot.onText(/Result/, getNewResult);
    bot.onText(/Register Link/,registerLink);
    bot.onText(/₹50000 Gift Code/, giftCode);
    bot.onText(/Free Deposit Bonus/,depositBonus);
    bot.on('callback_query', (callbackQuery) => {
        const data = callbackQuery.data;
        switch (data) {
            case 'add_channel':
                askForChannelAndSave(callbackQuery);
                break;
            case 'remove_channel':
                askForChannelAndRemove(callbackQuery);
                break;
            case 'check_join':
                VerifyUser(callbackQuery);
                break;
            case 'set_link':
                setLink(callbackQuery);
                break;
            case 'broadcast':
                Broadcast(callbackQuery);
                break;
            default:
                console.error('Unknown callback query data:', data);
        }
    });
}
