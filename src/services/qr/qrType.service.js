import prisma from '../../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central del tipo del qr
**/

class QrTypeService {
  async getQrType(qrType) {
    try {
      const qrTypeRecord = await prisma.qrType.findFirst({
        where: { type: qrType },
      });

      if (!qrTypeRecord) {
        throw new Error(`QR type '${qrType}' not found`);
      }

      return qrTypeRecord;
    } catch (error) {
      console.error("Error fetching QR type:", error);
      throw error;
    }
  }
}

export default new QrTypeService();
