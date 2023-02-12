require('dotenv').config();
const { sendMessage, getTextMessageInput } = require("../messageHelper");

module.exports = exports = {
    sendMessage: (req, res) => {
        // res.send("Test Successfully");

        var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Spirit Solutions !.');

        sendMessage(data).then((req, res) => {
            res.redirect('/');
            res.sendStatus(200);
            return;
        }).catch((err)=>{

            res.send(err);
        })

    }
}