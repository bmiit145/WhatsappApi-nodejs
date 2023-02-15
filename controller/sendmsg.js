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
            res.send("sent");               // response  to main func
            return;
        }).catch((err) => {
            console.log("error");
            // res.send(err);
            return;
        })

    },

    // sendTempMsg: (req, res) => {
    //     var data = getTemplatedMessageInput(process.env.RECIPIENT_WAID);

    //     sendMessage(data).then(function (response) {
    //         console.log("Successfully template send", process.env.RECIPIENT_WAID);
    //         res.send();                         // response  to main func
    //         return;
    //     }).catch(err => {
    //         // console.log("Not send On" , process.env.RECIPIENT_WAID);
    //         console.log(err);
    //         res.send(err);
    //         return;
    //     })
    // }

    sendTempMsg: (req, res) => {

        arr = [9979231280, 9898038051]

        arr.forEach(ele => {
            var data = getTemplatedMessageInput(ele);

            sendMessage(data).then(function (response) {
                console.log("Successfully template send", ele);
                res.send();                         // response  to main func
                return;
            }).catch(err => {
                // console.log("Not send On" , process.env.RECIPIENT_WAID);
                console.log(err);
                res.send(err);
                return;
            })
        });
    }
}