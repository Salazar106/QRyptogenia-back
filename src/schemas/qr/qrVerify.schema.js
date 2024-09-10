import Joi from 'joi';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:50:26
 * @description : Esquema validador para la peticion de verificacion del qr despues de su lecture, valida el elemento "q" de la query
**/

const queryIdVerifyQrSchema = Joi.object({
    q: Joi.string().uuid().required().messages({
        'string.base': 'El ID de QR debe ser un texto',
        'string.empty': 'El ID de QR no puede estar vacío',
        'string.guid': 'Dirección del qr inválida',
        'any.required': 'El ID de QR es obligatorio'
    })
});


export { queryIdVerifyQrSchema }