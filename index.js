const express = require('express');

const server = express();


server.listen(process.env.PORT, () => {
    console.log('server started..')
})
