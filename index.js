const express = require('express')
const app = express();
const port = 3000

const routes = require("./router")
app.use("/" , routes);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Whatsapp app listening on port ${port}!`));

