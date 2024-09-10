import prisma from "../../lib/prisma.js";
import { useSend } from "../../utils/useSend.js";

/**
 * @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
 * @description : Este endpoint obtiene una lista de todos los usuarios en la base de datos.
 *                Selecciona campos específicos de cada usuario.
 * @Params : nulll
 * @return :
 *   - Si se obtienen los usuarios exitosamente, retorna un estado 200 con un array de objetos JSON, 
 * cada uno representando un usuario con los campos
 */
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        state: true,
        rol: {
          select: {
            name: true,
          },
        },
      },
    });
    const usersData = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      state: user.state,
      rol: user.rol.name,
    }));

    res.status(200).json(usersData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};


export const updateMembership = async (req, res) => {
  const { id } = req.params;
  const { 
    type_membership, 
    price, 
    active_qrs, 
    scan_qrs, 
    premium_support, 
    unlimited_static_qrs, 
    state, 
    discounts 
  } = req.body;

  try {
    // Convertir los valores numéricos a sus tipos esperados
    const updatedPrice = parseFloat(price); // Convertir a decimal
    const updatedActiveQrs = parseInt(active_qrs, 10); // Convertir a entero
    const updatedScanQrs = parseInt(scan_qrs, 10); // Convertir a entero

    // Primero, actualiza la membresía sin afectar a DiscountMembership
    await prisma.membership.update({
      where: { id: id },
      data: {
        type_membership,
        price: updatedPrice,
        active_qrs: updatedActiveQrs,
        scan_qrs: updatedScanQrs,
        premium_support,
        unlimited_static_qrs,
        state,
      }
    });

    // Luego, maneja las relaciones DiscountMembership
    // Primero, elimina las asociaciones existentes
    await prisma.discountMembership.deleteMany({
      where: { membershipId: id }
    });

    // Luego, añade las nuevas asociaciones
    const createDiscountMemberships = discounts.map(discountId => ({
      discountId,
      membershipId: id
    }));

    await prisma.discountMembership.createMany({
      data: createDiscountMemberships
    });

    // Opcional: Puedes recuperar la membresía actualizada y las asociaciones de descuento
    const updatedMembership = await prisma.membership.findUnique({
      where: { id: id },
      include: { DiscountMembership: { include: { discount: true } } }
    });

    res.status(200).json(updatedMembership);
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ message: 'Server error' });
  }
}