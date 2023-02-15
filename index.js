const express = require('express')
const app = express();
const port = 3000

// mongoes connect 
const mongoose = require('mongoose'); 
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/whatsapp_no" ,{ family : 4})
.then(() => {
    app.listen(port, () => console.log(`Whatsapp app listening on port ${port}!`));
}).catch((err) => {
    console.log(err);
})



const routes = require("./router")
app.use("/" , routes);
app.get('/', (req, res) => res.send('Hello World!'))

