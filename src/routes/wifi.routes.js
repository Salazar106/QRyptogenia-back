import { Router } from "express";
import { GetWifi } from "../controllers/verifyQr/wifi.js";

const route=Router();

//ruta para la obtencion de la red wifi local
route.get("/getWifi",GetWifi);

export default route;
