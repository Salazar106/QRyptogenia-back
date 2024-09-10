import { Prisma } from '@prisma/client';
import boom from '@hapi/boom';
import { QrService } from '../../../../services/index.js';
import prisma from "../../../../lib/prisma.js";
import i18n from 'i18n';
import { useSend } from '../../../../utils/useSend.js';

/**
 * @Author : Jaider Cuartas,   @date 2024-07-15 19:34:37
 * @description : Este endpoint guarda un nuevo código QR en la base de datos.
 *                Recibe datos del QR desde el cuerpo de la solicitud y requiere la autenticación del usuario para obtener su ID.
 *                Valida los datos, crea el diseño del QR, el tipo, el nombre (si no se proporciona uno válido), y otros elementos relacionados.
 *                Luego guarda el código QR en la base de datos
 */

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-08 16:51:39
 * @description : Refactorización del código
**/

const createQrUserController = async (req, res, next) => {
    try {
        const qrData = req.body;
        const userId = req.userId;

        // Obtener la membresía del usuario
        const membershipUser = await prisma.membershipUser.findUnique({
            where: { userId },
            include: {
                membership: true,
            },
        });

        if (!membershipUser) {
            return res.json(useSend(i18n.__('No active membership was found for the user.')));
        }

        // Contar el número de QR activos del usuario
        const activeQrCount = await prisma.qr.count({
            where: {
                userId: userId,
                state: true, // Solo cuenta los QR activos
            },
        });

        // Verificar si se ha superado el número máximo de QR activos permitidos
        if (activeQrCount >= membershipUser.membership.active_qrs) {
            return res.json(useSend(i18n.__('You have reached the maximum number of active QR allowed by your membership.')));
        }

        // Si el límite no se ha alcanzado, crear el nuevo QR usando el servicio
        const newQr = await QrService.createQr(qrData, userId);

        res.status(201).json(newQr);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            next(boom.badImplementation('Database error: ' + e.message));
        } else {
            next(boom.boomify(e));
        }
    }
};

export { createQrUserController };