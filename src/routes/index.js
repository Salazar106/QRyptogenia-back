import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import userQrRoutes from "./userQr.routes.js";
import adminRoutes from "./admin.routes.js";
import musicRoutes from "./music.routes.js"
import storeRoutes from "./store.routes.js"
import wifiRoutes from "./wifi.routes.js"

import VerifyTokenJWT from "../middleware//VerifyTokenJWT.js";
import Authorization from "../middleware/Authorization.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import { queryIdVerifyQrSchema } from "../schemas/index.js";
import { verifyQrController } from "../controllers/index.js";
import { getMembership } from "../controllers/index.js";
const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", VerifyTokenJWT, userRoutes);
routes.use("/qr", VerifyTokenJWT, userQrRoutes);
routes.use("/admin", VerifyTokenJWT, adminRoutes); 
routes.get(
    '/verify-qr',
    validatorHandler(queryIdVerifyQrSchema, 'query'),
    verifyQrController
);
routes.get("/memberships", getMembership);
routes.use(musicRoutes);  
routes.use(storeRoutes);
routes.use(wifiRoutes);

export default routes;
