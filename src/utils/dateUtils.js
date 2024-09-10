/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:39:19
 * @description : Función para obtener la fecha y hora actual ajustada al huso horario GMT-5.
 * @Params : None
 * @return : Fecha actual ajustada
**/

function getDate() {
  let dateCurrent = new Date();
  dateCurrent.setHours(dateCurrent.getHours() - 5);
  return dateCurrent;
}

export { getDate };
