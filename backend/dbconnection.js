async function connectDB() {
  try {
    await connect(process.env.DB_URL);
    console.log("connected to db");
    // Server startup logic should be in index.js, not here.
  } catch (err) {
    console.log("error connecting to db", err);
  }
}

module.exports = { connectDB };