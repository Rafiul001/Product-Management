import { dbConnect, dbDisconnect } from "@server/dbConnection/dbConnection.js";
import v1Router from "@server/routes/index.js";
import config from "@shared/config/config.js";
import { serverError } from "@shared/utils/apiResponse.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";
import z from "zod";
import { startRefundCron } from "./cron/refundCron.js";

const app = express();
const port = config.PORT;

// Render (and most PaaS) terminate TLS at a reverse proxy and forward over http.
// Trusting the proxy lets Express see the original https protocol so that
// `secure` cookies are honoured and req.ip reflects the real client.
if (config.IS_PRODUCTION) {
  app.set("trust proxy", 1);
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [config.CLIENT_URL],
    credentials: true,
  }),
);

// Serve uploaded files
app.use("/uploads", express.static(config.UPLOAD_DIR));

// V1 API routes
app.use("/api/v1", v1Router);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello World!" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: "Validation error", error: err });
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    return res.status(409).json({ message: "Already exists" });
  }

  return serverError(res, "Internal Server Error");
});

const server = app.listen(port, "0.0.0.0", async () => {
  try {
    await dbConnect();
    console.log("Database connected successfully");
    startRefundCron();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
  console.log(`App listening on http://localhost:${port}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing server...`);

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await dbDisconnect();
      console.log("Database disconnected successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
