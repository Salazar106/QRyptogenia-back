/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:39:19
 * @description : Función para estructurar respuestas para el front end, incluyendo un mensaje y datos opcionales.
 * @Params : msg (Mensaje a enviar), info (Datos opcionales)
 * @return : Objeto con el mensaje y los datos
 * @nota : CAMBIAMOS SU USO POR LAS RESPUESTAS DE BOOM
**/

export function useSend (msg = "", info = null) {
    return {
        msg,
        info
    }
}
