require('dotenv').config(); //needed to get the value from the .env file
const express = require('express');
const server = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const userRoute = require('./routes/user');
const authRoute = require('./routes/Auth')
const userOperationRoute = require('./routes/user_operation')


// Connect to MongoDB
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URL);
    console.log("Db connected successfully");
}

// Set view engine and views directory
server.set("view engine", "ejs");
server.set("views", path.resolve("./view"));


// Middleware
const corsOptions = {
    origin: 'http://localhost:5173' // Specify the allowed origin
};

server.use(cors(corsOptions));
server.use(express.json());

// this middilewere specially used for handle the form data (because it is not a json data)
server.use(express.urlencoded({ extended: false }));


//specific middleeire for authentication is there or not
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        // Check if Authorization header is present
        const token = req.get('Authorization').split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET);
        if (decoded.email) {
            next()
        } else {
            res.sendStatus(401)
        }

    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};


// Routes
server.use('/auth', authRoute.authRouter);
server.use('/user', authMiddleware, userRoute);
server.use('/useroperation', authMiddleware, userOperationRoute.userOperationRouters)

// Serve static files
server.use(express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.get('/', (req, res) => {
    return res.render('profilepage');
});


// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
