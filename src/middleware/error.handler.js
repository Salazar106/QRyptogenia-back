/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:28:31
 * @description : Conjunto de middlewares para manejar y registrar errores en la aplicación.
 * @Params : err (Error object), req (Request), res (Response), next (Next middleware)
 * @return : Middleware functions
**/

export const logError = (err, req, res, next) => {
    console.error(err);
    next(err);
};

export const boomErrorHandler = (err, req, res, next) => {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    } else {
        next(err);
    }
};
/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, _next) => {
    res.status(500).json({
        message: err.message,
        stack: err.stack
    });
};