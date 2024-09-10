import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { sendVerificationEmail } from "./mail.service.js";
import { getDate } from "../utils/dateUtils.js";
import { useSend } from "../utils/useSend.js";
import i18n from 'i18n';
/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:47:10
 * @description : Funciones de servicio para la autenticacion, validacion de intentos de fallidos, generacion de token, envio de correo y verificacion de cuenta
 * @nota : Gestionar errores con boom y refactorizar 
**/

export const handleFailedLoginAttempts = async (userId, dateCurrent) => {
  const loginLog = await prisma.loginLogs.findUnique({
    where: { userId: userId },
  });

  if (loginLog && loginLog.failed_login >= 5) {
    const timeDifference = dateCurrent - new Date(loginLog.failed_login_time);
    if (timeDifference < 10 * 60 * 1000) {
      throw new Error(
        "You have exceeded the maximum number of failed login attempts. Please try again later."
      );
    }
    await prisma.loginLogs.update({
      where: { userId: userId },
      data: {
        failed_login: 0,
        failed_login_time: null,
      },
    });
  }
};



export const generateToken = (user, remember, res) => {
  const token = jwt.sign(
    { id: user.id, rol: user.rol.name },
    process.env.JWT_SECRET,
    {
      expiresIn: remember ? "365d" : "24h",
    }
  );

  res.cookie("token", token, {
    maxAge: remember ? 365 * 24 * 60 * 60 * 1000 : null,
    sameSite: "Lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    domain: res.req.hostname,
    path: "/",
  });

  return token;
};

export const sendVerifyEmail = async (req, res, existingPreRegister) => {
  const { email } = req.body;
  let dateCurrent = getDate();

  const pin = Math.floor(100000 + Math.random() * 900000);
  try {
    await sendVerificationEmail(email, pin);

    //* Si el usuario ya tiene un pre-registro, actualizarlo
    if (existingPreRegister) {
      await prisma.preRegister.update({
        where: { email: email },
        data: {
          pin: pin,
          last_pin_generated_at: dateCurrent,
        },
      });
      return res
        .status(200)
        .json(useSend(i18n.__("A new verification email has been sent")));
    }

    //* Si el usuario no tiene un pre-registro, crear uno nuevo
    await prisma.preRegister.create({
      data: {
        email: email,
        pin: pin,
        createdAt: dateCurrent,
        last_pin_generated_at: dateCurrent,
      },
    });

    return res.status(200).json(useSend(i18n.__("Verification email has been sent")));
  } catch (error) {
    return res
      .status(500)
      .json(
        useSend(i18n.__("Error sending verification email. Please try again later."))
      );
  }
};

export const verifyAccount = async (req, res) => {
  const { email, pin } = req.body;
  try {
    const preRegister = await prisma.preRegister.findUnique({
      where: { email: email },
    });

    if (!preRegister)
      return res.status(400).json(useSend(i18n.__("Try to generate the code again")));

    if (preRegister.pin !== parseInt(pin))
      return res
        .status(400)
        .json(
          useSend(i18n.__("The code you entered is not valid. Please use the most recent code from your email address.")
          )
        );

    return res.status(200).json(useSend(i18n.__("Verified code")));
  } catch (error) {
    return res
      .status(500)
      .json(
        useSend(i18n.__("Error sending verification email. Please try again later."))
      );
  }
};
