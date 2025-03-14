import express from "express";
import cors from "cors";
import "dotenv/config";

import promptRoute from "./routes/prompts.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/prompts", promptRoute);

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
