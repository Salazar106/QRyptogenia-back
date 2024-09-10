import prisma from "../../../../lib/prisma.js";
/*
 * @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
 * @description : Este endpoint obtiene una lista de todos los códigos QR asociados a un usuario específico.
 *                Requiere la autenticación del usuario para obtener su ID. Selecciona campos específicos de cada
 *                código QR
 */

/**
 * @UpdatedBy : Jobserd Julián Ocampo,   @date 2024-08-08 10:54:35
 * @description : Refactotización del código
**/

const getQrUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
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
                qr_image_base64: true,
            },
        });
  
        const qrCodesWithBase64 = qrCodes.map(qrCode => ({
            ...qrCode,
            qr_image_base64: qrCode.qr_image_base64.toString('base64'),
        }));
  
        res.json(qrCodesWithBase64);
    }catch (e) {
        next(e);
    }
};

export { getQrUserController }

const getMembership = async (req, res) => {
    try {
      // Obtener todas las membresías con sus descuentos relacionados
      const memberships = await prisma.membership.findMany({
        select: {
          id: true,
          type_membership: true,
          description: true,
          membership_duration: true,
          price: true,
          active_qrs: true,
          scan_qrs: true,
          premium_support: true,
          unlimited_static_qrs: true,
          state: true,
          DiscountMembership: {
            select: {
              discount: {
                select: {
                  id: true,
                  discount: true,
                  description: true // Ajusta el campo según la estructura de tu modelo
                }
              }
            }
          }
        }
      });
  
      // Obtener todos los descuentos disponibles
      const discounts = await prisma.discount.findMany({
        select: {
          id: true,
          discount: true,
          description: true// Ajusta el campo según la estructura de tu modelo
        }
      });
  
      // Formatear las membresías para incluir los descuentos
      const membershipData = memberships.map((membership) => ({
        id: membership.id,
        type_membership: membership.type_membership,
        price: membership.price,
        active_qrs: membership.active_qrs,
        scan_qrs: membership.scan_qrs,
        premium_support: membership.premium_support,
        unlimited_static_qrs: membership.unlimited_static_qrs,
        state: membership.state,
        discounts: membership.DiscountMembership.map(dm => dm.discount.id) // Incluye los IDs de los descuentos
      }));
      
      // Enviar la respuesta con las membresías y descuentos
      res.status(200).json({ memberships: membershipData, discounts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get memberships and discounts" });
    }
  };

  export { getMembership }
