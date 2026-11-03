import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDatabase } from "./config/db";

const port = Number(process.env.PORT || 5000);
connectDatabase()
  .then(() => app.listen(port, () => console.log(`Studio Nora API running on port ${port}`)))
  .catch(error => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
