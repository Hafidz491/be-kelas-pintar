import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

import globalRoutes from "./routes/globalRoutes.js";

dotenv.config();

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", globalRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
