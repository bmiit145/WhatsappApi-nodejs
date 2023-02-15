const express = require('express');
const app = express();

const MessageRouter = require("./routes/sendmessage");
const ContactRouter =  require('./routes/contact');


app.use("/msg" , MessageRouter);
app.use("/Contact" , ContactRouter);


module.exports = app;