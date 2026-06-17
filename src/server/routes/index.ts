import { Router } from "express";
import adminRouter from "./adminRouter/index.js";
import bannerRouter from "./bannerRouter/index.js";
import cartRouter from "./cartRouter/index.js";
import categoryRouter from "./categoryRouter/index.js";
import cronSettingsRouter from "./cronSettingsRouter/index.js";
import newArrivalRouter from "./newArrivalRouter/index.js";
import offerRouter from "./offerRouter/index.js";
import orderRouter from "./orderRouter/index.js";
import productRouter from "./productRouter/index.js";
import reviewRouter from "./reviewRouter/index.js";
import stockEntryRouter from "./stockEntryRouter/index.js";
import subCategoryRouter from "./subCategoryRouter/index.js";
import userRouter from "./userRouter/index.js";

const v1Router = Router();

v1Router.use("/admin", adminRouter);
v1Router.use("/user", userRouter);
v1Router.use("/category", categoryRouter);
v1Router.use("/sub-category", subCategoryRouter);
v1Router.use("/product", productRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/stock-entry", stockEntryRouter);
v1Router.use("/banner", bannerRouter);
v1Router.use("/offer", offerRouter);
v1Router.use("/review", reviewRouter);
v1Router.use("/new-arrival", newArrivalRouter);
v1Router.use("/cron-settings", cronSettingsRouter);

export default v1Router;
