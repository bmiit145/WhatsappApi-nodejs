const express = require('express')
const app = express();
const port = 3000

const routes = require("./router")
app.use("/" , routes);
app.get('/', (req, res) => res.send('Hello World!'))

// Start server immediately — MongoDB is optional
app.listen(port, () => console.log(`Whatsapp app listening on port ${port}!`));

// mongoes connect 
const mongoose = require('mongoose'); 
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/whatsapp_no" ,{ family : 4})
.then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB not connected (senddb route will not work):", err.message);
})

