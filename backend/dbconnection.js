const { connect } = require("mongoose");

async function connectDB() {
  try {
    await connect(process.env.DB_URL);
    console.log("connected to db");
  } catch (err) {
    console.error("Error connecting to db:", err.message);
    process.exit(1); // Exit process with failure
  }
}

module.exports = { connectDB };