const express = require('express');
const cors = require('cors');
const path = require('path');
 
const {config}  = require('dotenv') 
const {connectDB} = require('./dbconnection.js')
const {UserRouter} = require('./routes/user.js')
const {login} = require('./routes/login.js')  
const {logout} = require('./routes/logout.js')
const cookieParser = require('cookie-parser');
const {auth} = require('./middlewares/authentication.js');
const {IssueRouter} = require('./routes/issues');
const {NotificationRouter}   = require('./routes/notification');
const {authorize} = require('./middlewares/authorize.js');
const {RegisterRouter} = require('./routes/register.js'); 
const { AdminRouter } = require('./routes/admin.js');

 
config({ path: path.join(__dirname, '.env') })

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}))
 // Enable All CORS Requests
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());

app.use("/api/user",auth , UserRouter);
app.use("/api/login",login);
app.use("/api/logout", auth,authorize("user","admin","worker"), logout);
app.use("/api/issues",auth,authorize("user","admin","worker"),IssueRouter);
app.use("/api/notifications",auth,authorize("user","admin","worker"),NotificationRouter);
app.use("/api/admin", auth, authorize("admin"), AdminRouter);
app.use("/api/register",RegisterRouter);
app.use("/api/me",auth,(req,res)=>{
  res.json({user:req.user});
});



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
