import express from "express";
import cors from "cors";

import { terraformRouter } from "./routes/terraform.js";
import { costRouter } from "./routes/cost.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/terraform", terraformRouter);
app.use("/cost", costRouter);

app.listen(PORT, () => {
  console.log(`InfraForge API running at http://localhost:${PORT}`);
});
