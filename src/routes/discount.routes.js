import { Router } from "express";
import { changeState, CreateDiscount, deleteDiscount, GetDiscounts, getOneDiscount, updateDiscount } from "../controllers/admin/discounts.controller.js";

const routes=Router();

//rutas discount

routes.post("/addDiscount",CreateDiscount);
routes.get("/getDiscount",GetDiscounts);
routes.get("/getDiscount/:id",getOneDiscount);
routes.put("/putDiscount/:id",updateDiscount);
routes.patch("/changeState/:id",changeState);
routes.delete("/deleteDiscount/:id",deleteDiscount);

export default routes;