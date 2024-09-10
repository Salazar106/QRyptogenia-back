import nodemailer from "nodemailer";

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:49:20
 * @description : Servicio dedicado al envio de correos
**/

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendRecoverEmail(email, token, id) {
  return await transporter.sendMail({
    from: "Qryptogenia",
    to: email,
    subject: "Verificación de nueva cuenta - Qryptogenia",
    html: RecoverPassEmail(token, id),
  });
}

function RecoverPassEmail(token, id) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <style>
        html{
            background-color: white;
        }
        body{
            max-width: 600px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: auto;
            background-color: rgb(229, 255, 246);
            padding: 40px;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
    <body>
        <h1>Recuperación de contraseña</h1>
        <p>Hemos enviado un correo electrónico de recuperación de contraseña para tu cuenta en Qryptogenia.</p>
        <p>Por favor, sigue las instrucciones en el correo electrónico para restablecer tu contraseña.</p>
        <p>Cambia la contraseña de la cuenta: <a href="http://localhost:5173/recoverPassword?token=${token}" target="_blank" rel="noopener noreferrer">haciendo click aquí</a>.
    </body>
    </html>
    `;
}

export async function sendVerificationEmail(direccion, pin) {
  try {
    const mailOptions = {
      from: "Qryptogenia",
      to: direccion,
      subject: "Verificación de nueva cuenta - Qryptogenia",
      html: createVerificationEmail(pin),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

export async function sendVerificationChangeEmail(direccion, pin) {
  try {
    const mailOptions = {
      from: "Qryptogenia",
      to: direccion,
      subject: "Verificación dcambio de correo - Qryptogenia",
      html: createVerificationEmail(pin),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error; 
  }
}
export async function sendVerificationChangeNewEmail(direccion, pin) {
  try {
    const mailOptions = {
      from: "Qryptogenia",
      to: direccion,
      subject: "Verificación dcambio de correo - Qryptogenia",
      html: createVerificationEmail(pin),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error; 
  }
}


function createVerificationEmail(code) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <body style="max-width: 600px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: auto; background-color: rgb(229, 255, 246); padding: 40px; border-radius: 4px; margin-top: 10px;">
        <h1>E-mail verification</h1>
        <p>You are one step away from completing your registration.</p>
        <p>Enter the following code on the page to complete the registration: <strong>${code}</strong>.</p>
    </body>
    </html>
    `;
}
