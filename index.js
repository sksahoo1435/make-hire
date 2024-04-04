require('dotenv').config(); //needed to get the value from the .env file
const express = require('express');
const server = express();
const cors = require('cors');
const mongoose = require('mongoose');



//for connecting with db

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URL);
    console.log("Db connected successfully");
}

// middilewire for the express project(server)

server.use(cors());
server.use(express.json()); //This line adds middleware to parse JSON bodies sent in the HTTP request




server.get('/', (req, res) => {
    res.send('Hello, World!');
});


server.listen(process.env.PORT, () => {
    console.log('server started..')
})
