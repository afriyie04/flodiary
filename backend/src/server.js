const express = require('express');
     bodyParser = require("body-parser")
     mongoose = require('mongoose');
     app = express();
     errorHandler = require('./src/middleware/errorHandler');
     path = require('path');
     bcrypt = require('bcrypt');
     jwt = require('jsonwebtoken');
     connectDB = require('./src/config/db');


//define a port
PORT = process.env.PORT || 3000
const cors = require('cors');
dotenv = require('dotenv').config();

//connect to the database
connectDB();

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//routes
const userRoutes = require('./src/routes/userRoute');
const cycleRoutes = require('./src/routes/cycleRoute');
const authRoutes = require('./src/routes/authRoute');
const symptomRoutes = require('./src/routes/symptomRoute');

//error handler
app.use(errorHandler);

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});