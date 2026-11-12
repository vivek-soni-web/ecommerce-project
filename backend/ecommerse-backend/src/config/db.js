const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected Successfully");
    console.log("Database Host:", mongoose.connection.host);

  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
