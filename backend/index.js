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
const { WorkerRouter } = require('./routes/worker.js');

 
config({ path: path.join(__dirname, '.env') })

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}))
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/user",auth , UserRouter);
app.use("/api/login",login);
app.use("/api/logout", auth,authorize("user","admin","worker"), logout);
app.use("/api/issues",auth,authorize("user","admin","worker"),IssueRouter);
app.use("/api/notifications",auth,authorize("user","admin","worker"),NotificationRouter);
app.use("/api/admin", auth, authorize("admin"), AdminRouter);
app.use("/api/worker", auth, authorize("worker"), WorkerRouter);
app.use("/api/register",RegisterRouter);
app.use("/api/me",auth,(req,res)=>{
  res.json({user:req.user});
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
    reason: `Route ${req.method} ${req.path} does not exist`
  });
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.message === 'CORS not allowed') {
    return res.status(403).json({
      message: "CORS Error",
      reason: "Origin not allowed"
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: "Invalid ID format",
      reason: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation error",
      reason: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    reason: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const startServer = async () => {
  // Validate environment variables
  const requiredEnvVars = ['DB_URL', 'JWT_SECRET', 'CLIENT_URL'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
