import bcrypt from "bcryptjs";
import { getDate } from "../src/utils/dateUtils.js";
import prisma from "../src/lib/prisma.js";

/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:39:19
 * @description : Script de inicialización de la base de datos. Crea roles, tipos de QR, un usuario administrador con una contraseña encriptada, y un registro de inicio de sesión.
 * @Params : None
 * @return : None
 * @nota : A PARTIR DE ACÁ SE CREAN LOS ARCHIVOS SEED PARA REGISTROS INCIALES
**/

async function main() {
  const currentDate = getDate();

  await prisma.rol.createMany({
    data: [
      { name: "ADMIN", state: true, createdAt: currentDate },
      { name: "CLIENT", state: true, createdAt: currentDate },
    ],
  });

  const qrTypes = [
    { type: "app-store", description: "Link your app in all stores" },
    {
      type: "social-media",
      description: "Link to all your social media channels",
    },
    { type: "website-url", description: "Link to the website of your choice" },
    { type: "pdf", description: "Show or download your pdf" },
    { type: "news", description: "hello world" },
    { type: "music", description: "Link your song in all music apps" },
    { type: "wifi", description: "Connect to a wireless network" },
    { type: "curriculum", description: "Share your electronic business card" },
    { type: "food-Menu", description: "Create a digital restaurant menu" },
  ];

  await prisma.qrType.createMany({
    data: qrTypes.map((qrType) => ({
      type: qrType.type,
      description: qrType.description,
    })),
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      createdAt: currentDate,
      state: true,
      rol: {
        connect: { id: 1 },
      },
    },
  });

  await prisma.loginLogs.create({
    data: {
      created_ip: "127.0.0.1",
      user: {
        connect: { id: adminUser.id },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
