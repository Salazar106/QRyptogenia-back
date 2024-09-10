import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { useSend } from "../utils/useSend.js";

/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:28:31
 * @description : Middleware para verificar tokens JWT. Valida el token de autenticación y asegura que el usuario exista antes de continuar.
 * @Params : req (Request), res (Response), next (Next middleware)
 * @return : Middleware function
**/

const NO_AUTH_TOKEN = "Authentication required";
const TOKEN_VERIFICATION_FAILED = "Token verification failed, authorization denied.";
const USER_DOESNT_EXIST = "User doesn't exist, authorization denied.";

const sendErrorResponse = (res, message) => {
  return res.status(401).json(useSend(message));
};

const VerifyTokenJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return sendErrorResponse(res, NO_AUTH_TOKEN);

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) return sendErrorResponse(res, TOKEN_VERIFICATION_FAILED);

    const user = await prisma.user.findUnique({
      where: { id: verified.id },
    });

    if (!user) return sendErrorResponse(res, USER_DOESNT_EXIST);

    req.userId = user.id;
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      result: null,
      message: err.message,
      error: err,
    });
  }
};

export default VerifyTokenJWT;