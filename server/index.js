import express from "express";
import cors from "cors";
import "dotenv/config";

import promptRoute from "./routes/prompts.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/prompts", promptRoute);

const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
  console.log(formattedDate);
});
