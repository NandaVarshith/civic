const express = require('express');
const cors = require('cors');
 
const {config}  = require('dotenv') 
const {connectDB} = require('./dbconnection.js')
const {UserRouter} = require('./routes/user.js')
const {login} = require('./routes/login.js')  
const {logout} = require('./routes/logout.js')
const cookieParser = require('cookie-parser');
const {auth} = require('./middlewares/authentication.js');
const user = require('./routes/user.js');
const issue = require('./routes/issues');
 
config()

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}))
 // Enable All CORS Requests
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", UserRouter);
app.use("/api/login", login);
app.use("/api/logout", auth, logout);
app.use("/api/issues",issue);



// Error handling middleware
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message:"error",reason:err.message});
});

const startServer = async () => {
  // connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
