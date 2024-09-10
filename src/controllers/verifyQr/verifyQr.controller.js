import prisma from "../../lib/prisma.js";
import Boom from '@hapi/boom';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-07-19 09:02:42
 * @description : Esta función verifica la validez de un QR, comprobando la cantidad de escaneos permitidos, el estado del QR (activo o inactivo) y las membresías asociadas.
 * @Params : El id del QR se obtiene a través de una query
 * @return: Retorna mensajes de validación del QR y otros posibles errores. Si todo es correcto, también retorna el elemento QR correspondiente.
**/

const verifyQrController = async (req, res, next) => {
    const qrId = req.query.q;

    if (!qrId) {
        return next(Boom.badRequest('ID de QR no proporcionado'));
    }
    try {
        const qrData = await findQrInDatabase(qrId);

    if (!qrData) {
                return next(Boom.notFound('QR no encontrado'));
            }


        const imgBoxBackgroundBase64 = qrData.QrPreview
        ? qrData.QrPreview.imgBoxBackgroud.toString('base64')
        : null;

        const responseData = {
            ...qrData,
            QrPreview: {
                ...qrData.QrPreview,
                imgBoxBackgroundBase64,
            },
        };
        res.json(responseData);

    } catch (err) {
        console.error(err);
        next(Boom.internal('Error interno del servidor'));
    }
};

const findQrInDatabase = async (id) => {
    return await prisma.qr.findUnique({
        where: { 
            id,
            state: true,
        },
        include: {
            QrDesign: true,
            QrText: {
                include: {
                    QrTextFont: true,
                    QrTextBubble: true,
                },
            },
            QrLogo: true,
            QrPreview: true,
            user: true,
        },
    });
};

export {verifyQrController};