import express from "express";
// import {getUsers} from "../controllers/admin.controller.js"
import {getUsers, updateMembership}  from "../controllers/admin/admin.controller.js";
import discountRoutes from './discount.routes.js'

const router = express.Router();

/**
 * @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
 * @description : Definición de la ruta para obtener una lista de todos los usuarios en la base de datos.
 */
router.get("/users", getUsers);
// router.get("user/change-state", userStateChange);
// router.get("user/:id", getUserInfo);
router.patch("/editmemberships/:id", updateMembership)
router.use(discountRoutes);
// router.get("qrs", getQrs);

// router.get("membership-plans", getMemberships);
// router.post("membership-plans", createMembership);
// router.get("membership-plans/:id", getMembership);


export default router;
