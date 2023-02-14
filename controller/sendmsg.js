require('dotenv').config();
const { sendMessage, getTextMessageInput, getTemplatedMessageInput } = require("../messageHelper");

module.exports = exports = {
    sendMsg: (req, res) => {
        // res.send("Test Successfully");

        var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Spirit Solutions');

        sendMessage(data).then((respose) => {
            console.log("success");
            // res.redirect('/');
            // res.sendStatus(200);
            res.send("sent");
            return 0;
        }).catch((err) => {
            console.log("error");
            // res.send(err);
        })

    },

    sendTempMsg: (req, res) => {
        var data = getTemplatedMessageInput(process.env.RECIPIENT_WAID);

        sendMessage(data).then(function (response) {
                console.log("Successfully template send", process.env.RECIPIENT_WAID);
                res.send();
                return;
            }).catch(err => {
                // console.log("Not send On" , process.env.RECIPIENT_WAID);
                console.log(err);
                // res.send(err);   
                return;
            })
    }
}