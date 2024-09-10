import express from "express";
import bcrypt from "bcryptjs";
import {
  login,
  logout,
  register,
  completeRegister,
  forgot_password,
  recoverPassword,
  googleauth,
  googlecall,
} from "../controllers/auth.controller.js";
import { verifyAccount } from "../services/auth.service.js";
const plaintextPassword = "dav39484"; // Tu contraseña en texto plano
import jwt from "jsonwebtoken";
import { verifyRecaptcha } from "../services/verifyRecaptcha.service.js";
import prisma from "./../lib/prisma.js";

// Genera el hash de la contraseña
const hashedPassword = bcrypt.hashSync(plaintextPassword, 10);

// Guarda el hash en tu base de datos
// Aquí debes implementar la lógica para guardar el hash en tu base de datos
console.log("Hash de la contraseña:", hashedPassword);

const router = express.Router();

router.post("/register", register);
router.post("/complete-register", completeRegister);
router.post("/login", login);
router.get("/logout", logout);
router.post("/confirm", verifyAccount);

  // @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
  // @description : Definición de rutas para el manejo de restablecimiento de contraseñas.
router.post("/password_reset", forgot_password);
router.post("/password_reset/confirm", recoverPassword);

router.post("/verifyRecaptcha", verifyRecaptcha);


  // @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
  //@description : Definición de rutas para el manejo de autenticación de Google.
router.get("/google", googleauth);
router.get("/google/callback", googlecall);

router.get("/check-token", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        rol: true,
      },
    });
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol.name,
    };
    
    return res.status(200).json({ user: userResponse });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


/**
 * @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
 * @description : Este endpoint obtiene todos los códigos QR asociados a un usuario específico.
 *                Filtra los códigos QR por el ID del usuario proporcionado en la consulta y 
 *                selecciona información relevante incluyendo el tipo de QR.
 *                Además, convierte la imagen del QR a base64 para su envío.
 * @Params : - userId:  El ID del usuario cuyos códigos QR se desean obtener.
 * @return :
 *   - Si se obtienen los códigos QR exitosamente, retorna un estado 200 y un JSON, cada uno representando un código QR con los campos
 */
router.get('/qrcodes', async (req, res) => {
  const { userId } = req.query;

  try {
      const qrCodes = await prisma.qr.findMany({
          where: {
              userId: userId,
          },
          select: {
              id: true,
              name_qr: true,
              qrTypeId: true,
              state: true,
              createdAt: true,
              qrType: {
                  select: {
                    id: true,
                      type: true,
                      description: true,
                  },
              },
              qr_image_base64: true
    },
});

const qrCodesWithBase64 = qrCodes.map(qrCode => ({
    ...qrCode,
    qr_image_base64: qrCode.qr_image_base64.toString('base64')
}));

res.json(qrCodesWithBase64);
  } catch (error) {
      console.error('Error fetching QR codes:', error);
      res.status(500).json({ error: 'Error fetching QR codes' });
  }
});

router.patch('/qrcodes/:id', async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  try {
      const updatedQR = await prisma.qr.update({
          where: { id },
          data: { state },
      });

      res.json(updatedQR);
  } catch (error) {
      console.error('Error updating QR code:', error);
      res.status(500).json({ error: 'Failed to update QR code' });
  }
});

export default router;
