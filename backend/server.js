import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import verifyRoute from "./routes/verify.js";
import guidanceRoute from "./routes/guidance.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/verify", verifyRoute);
app.use("/api/guidance", guidanceRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Pulse: ONLINE | Port ${PORT}`));
