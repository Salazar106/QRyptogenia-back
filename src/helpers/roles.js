/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:39:19
 * @description : Definición de roles de usuario y sus permisos asociados. 
 * @Params : None
 * @return : Objecto roles con permisos
 * @nota : FUTURA IMPLEMENTACION CON EL MIDDLEWARE DE AUTHORIZATION
**/

const roles = {
  ADMIN: ["read", "write", "delete"],
  CLIENT: ["read"],
  GUEST: [], //? El no autenticado
};

export default roles;
