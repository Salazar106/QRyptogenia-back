import { PrismaClient } from '@prisma/client'

let prisma = new PrismaClient();

// async function main() {
// /*async function main() {
//   const rol = await prisma.rol.create({
//     data: {
//       name: "ADMIN",
//     },
//   });

//   const user = await prisma.user.create({
//     data: {
//       username: "admin",
//       email: "admin@gmail.com",
//       password: "123",
//       rolId: rol.id,
//     },
//   });

//   const loginLogs = await prisma.loginLogs.create({
//     data: {
//       created_ip: "::1",
//       userId: user.id,
//     },
//   });
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

export default prisma;
