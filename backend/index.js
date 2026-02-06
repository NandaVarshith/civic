const express = require('express');

const {config}  = require('dotenv') 
const {connectDB} = require('./dbconnection.js')
const {register} = require('./routes/register.js')
const {login} = require('./routes/login.js')  
 
config()

const app = express();

app.use(express.json());

// connect to MongoDB
connectDB();


app.use("/api/register", register);
app.use("/api/login", login);

// Error handling middleware
app.use((err,req,res,next)=>{
  res.status(500).json({Message:"error",reason:err.message})
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});