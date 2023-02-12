const express = require('express');
const app = express();

const MessageRouter = require("./routes/sendmessage");
app.use("/msg" , MessageRouter);


module.exports = app;