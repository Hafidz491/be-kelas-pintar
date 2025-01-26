import mongoose from "mongoose";

export default function db() {
  const DATABASE_URL = process.env.MONGO_URI;

  try {
    mongoose.connect(DATABASE_URL);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const dbConn = mongoose.connection;

  dbConn.once("open", (_) => {
    console.log(`Database connected to: ${DATABASE_URL}`);
  });

  dbConn.on("error", (err) => {
    console.log(`Connection Error: ${err}`);
  });
}
