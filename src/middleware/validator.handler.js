import boom from '@hapi/boom';

/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:28:31
 * @description : Middleware para validar datos de la solicitud según un esquema Joi. Si falla, lanza un error personalizado con los campos requeridos.
 * @Params : schema (Joi schema), property (req property to validate)
 * @return : Middleware function
**/

const validatorHandler = (schema, property) => {
    return function (req, res, next){
        const data = req[property];
        const {error} = schema.validate(data, {abortEarly: false});
        if (error != null) {
            const fields = error.details
                .map(detail => detail.context.label);
            const errorMessage = error.message;
            const customError = boom.badRequest(errorMessage);

            customError.output.payload.requiredFields = fields;
            next(customError);
        }
        next();
    };
};
export {validatorHandler};