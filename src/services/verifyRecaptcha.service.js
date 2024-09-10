import prisma from "../lib/prisma.js";

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:49:46
 * @description : Servicio dedicado a la verificacion del recapcha
**/

export const verifyRecaptcha = async (req, res) => {
  try {
    const { recaptchaToken, email } = req.body;

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_KEY,
          response: recaptchaToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error verifying reCAPTCHA");
    }

    let recaptchaResponse;
    recaptchaResponse = await response.json();

    const recaptchaSuccess = recaptchaResponse.success;

    if (recaptchaSuccess) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.loginLogs.update({
          where: { userId: user.id },
          data: {
            failed_login: 0,
            failed_login_time: null,
          },
        });
      }
    }

    res.json({ success: recaptchaSuccess });
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).json({ error: "Error verifying reCAPTCHA" });
  }
};
