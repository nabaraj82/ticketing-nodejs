const dotenv = require("dotenv");
dotenv.config({
    path: './config.env'
});

const app = require("./app");


const port = process.env.PORT || 4001;

const server = app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`)
});
