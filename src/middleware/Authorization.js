import roles from '../helpers/roles.js';
import prisma from '../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:28:31
 * @description : Middleware de autorización basado en roles de usuario. Verifica si el rol del usuario cumple con el rol requerido.
 * @Params : requiredRole (Rol necesario para acceder)
 * @return : Middleware function
 * @nota : FUTURA IMPLEMENTACION, PARA GESTION DE PERMISOS SEGUN EL ROL
**/

const Authorization = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;

            const user = await prisma.user.findUnique({
                where: { id: userId, state: true },
            });

            const userRole = user.rol.name;
            if (roles[userRole].includes(requiredRole)) {
                next();
            } else {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
        } catch (error) {
            return res.status(500).json({ message:  `Internal server error ${error}`  });
        }
    };
};

export default Authorization;
