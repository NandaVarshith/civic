const express = require('express');
const { connect } = require('mongoose');
const userApp = require('./routes/UserAPI.js');
const {config}  = require('dotenv') 
config()
const app = express();

app.use(express.json());

async function connectDB() {
  try {
    await connect(process.env.DB_URL);
    console.log("connected to db");
    // assign port and start server
    app.listen(process.env.PORT, () => console.log("server listening on port 3000"));
  } catch (err) {
    console.log("error connecting to db", err);
  }
}
connectDB();


app.use("/user-api", userApp);

// error handling middleware
app.use((err,req,res,next)=>{
  res.status(500).json({Message:"error",reason:err.message})
})
