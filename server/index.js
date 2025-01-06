require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const AuthRouter=require('./routes/auth')
const StudentRouter=require('./routes/student')
const CourseRouter=require('./routes/course')
const path = require('path');

const app = express();

//middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/api/v1/admin',AuthRouter)
app.use('/api/v1/admin',StudentRouter)
app.use('/api/v1/admin',CourseRouter)
// Serve static files from the 'uploads' directory

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('connected with database');

    app.listen(PORT, () => {
      console.log(`Server is listening on the ${PORT}`);

    });
  } catch (error) {
    console.log(error);
  } 
};

start();
