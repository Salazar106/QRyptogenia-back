import prisma from "../../lib/prisma.js";
import { useSend } from "../../utils/useSend.js";
import cloudinary from 'cloudinary';
import bcrypt from "bcryptjs";
import { sendVerificationChangeEmail, sendVerificationChangeNewEmail } from "../../services/mail.service.js";
import i18n from "i18n";
const checkPassword = async (user, password) => {
  try {
    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos usando bcrypt
    const match = await bcrypt.compare(password, user.password);

    // Si las contraseñas coinciden, devolver true; de lo contrario, devolver false
    return match;
  } catch (error) {
    console.error('Error checking password:', error);
    throw new Error('Failed to check password');
  }
};


cloudinary.config({
  cloud_name: 'db4rqcf3o',
  api_key: '668756849283491',
  api_secret: 'Mb2UbGHFALvahWlVuud0tBKmDYQ'
});

export const getUser = async (req, res) => {
  try {
    const _user = await prisma.user.findUnique({
      where: { id: req.userId, state: true },
      select: {
        profile_picture: true,
        username: true,
        email: true,
        rol: true,
      },
    });

    const user = {
      ..._user,
      rol: _user.rol.name,
    };

    res.status(200).json(useSend("", user));
  } catch (err) {
    res.status(500).json(useSend(i18n.__("Failed to get user!")));
  }
};

export const getImage = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId, state: true },
      select: {
        profile_picture: true,
      },
    });

    // Si el usuario existe y tiene una imagen de perfil, devolvemos la URL de la imagen
    if (user && user.profile_picture) {
      res.status(200).json({ image_url: user.profile_picture });
    } else {
      res.status(404).json({ error: "User or profile picture not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get user!" });
  }
};

export const changeProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Subir el archivo a Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);

    // Obtener la URL de la imagen subida desde Cloudinary
    const imageUrl = cloudinaryResponse.secure_url;

    // Actualizar la URL de la imagen de perfil en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: { profile_picture: imageUrl },
    });

    // Devolver la URL de la imagen actualizada como respuesta
    return res.status(200).json({ image_url: imageUrl });
  } catch (error) {
    console.error('Error changing profile picture:', error);
    return res.status(500).json({ error: 'Failed to change profile picture' });
  }
};


export const changeUsername = async (req, res) => {
  try {
    // Extract user ID from request (assuming it's available)
    const userId = req.userId;

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the new username and password from the request body
    const { new_username, password } = req.body;

    // Validate the new username (optional, add validation logic here)
    if (!new_username || new_username.trim() === '') {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Verify the password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Update the username in the database
    await prisma.user.update({
      where: { id: userId },
      data: { username: new_username },
    });

    // Return success message
    return res.status(200).json({ success: 'Username changed successfully' });
  } catch (error) {
    console.error('Error changing username:', error);
    return res.status(500).json({ error: 'Failed to change username' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    // Verifica si la solicitud contiene los datos necesarios
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return res.status(400).json({ error: 'Se requieren la contraseña anterior y la nueva contraseña.' });
    }

    // Busca al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Verifica si el usuario existe
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Verifica si la contraseña anterior coincide
    const match = await bcrypt.compare(old_password, user.password)
    if (!match) {
      return res.status(400).json({ error: 'La contraseña anterior es incorrecta.' });
    }

    // Cambia la contraseña del usuario
    const encriptpass = await bcrypt.hash(new_password, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: encriptpass },
    });

    return res.status(200).json({ message: 'Contraseña cambiada con éxito.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al cambiar la contraseña.' });
  }
};

export const changeEmail = async (req, res) => {
  const { email } = req.body;
  // Generar y enviar el código de verificación al correo electrónico actual
  try {
    const pin = Math.floor(1000 + Math.random() * 9000);
    await sendVerificationChangeEmail(email, pin);
    // Guardar el código de verificación en la base de datos o en la sesión del usuario
    req.session.emailVerificationPin = pin;
    res.status(200).json(useSend(i18n.__("A verification email has been sent to the current email")));
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json(useSend(i18n.__("Error sending verification email")));
  }
};


export const verifyAccountt = async (req, res) => {
  const { pin } = req.body;

  try {
    // Verificar si el pin coincide con el código de verificación almacenado
    if (req.session.emailVerificationPin !== parseInt(pin)) {
      return res.status(400).json(useSend(i18n.__("Incorrect verification code")));
    }

    res.status(200).json(useSend(i18n.__("Successful email change")));
  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json(useSend(i18n.__("Account verification error")));
  }
};

export const sendVerifyNewEmail = async (req, res) => {
  const { newEmail } = req.body;

  // Generar y enviar el código de verificación al correo electrónico actual
  try {
    const pin = Math.floor(1000 + Math.random() * 9000);
    await sendVerificationChangeNewEmail(newEmail, pin);
    // Guardar el código de verificación en la base de datos o en la sesión del usuario
    req.session.NewEmailVerificationPin = pin;
    req.session.newEmail = newEmail;
    res.status(200).json(useSend(i18n.__("A verification email has been sent to the current email")));
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json(useSend(i18n.__("Error sending verification email")));
  }
};

export const verifyNewEmail = async (req, res) => {
  const { newPin } = req.body;


  try {
    if (req.session.NewEmailVerificationPin !== parseInt(newPin)) {
      return res.status(400).json({ error: "Código de verificación incorrecto" });
    }

    // Código de verificación correcto, realizar cambio de correo electrónico en la base de datos
    // Implementar lógica para cambiar el correo electrónico en la base de datos
    const newEmail = req.session.newEmail;

    // Actualizar el correo electrónico del usuario en la base de datos
    await prisma.user.update({
    where: { id: req.userId },
    data: { email: newEmail }
    });


    res.status(200).json({ message: "Cambio de correo electrónico exitoso" });
  } catch (error) {
    console.error('Error verifying new email:', error);
    res.status(500).json({ error: "Error verificando nuevo correo electrónico" });
  }
};


export const AssignMembership = async (req, res) => {
  const { membershipId } = req.body;
  const userId = req.userId;

  try {
    console.log(userId)
    // Buscar el plan de membresía en la base de datos
    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
    });

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    // Calcular la fecha límite basada en la duración de la membresía
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() + membership.membership_duration.getMonth());

    // Crear o actualizar la relación en la tabla MembershipUser
    const membershipUser = await prisma.membershipUser.upsert({
      where: {
        // Usa la combinación única de membershipId y userId
        membershipId_userId: {
          membershipId: membershipId,
          userId: userId,
        },
      },
      update: {
        update_date: new Date(),
        limit_date: limitDate,
      },
      create: {
        userId: userId,
        membershipId: membershipId,
        limit_date: limitDate,
        createdAt: new Date(),
      },
    });

    return res.status(200).json(useSend(i18n.__("Membership Selected Correctly")));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




