import prisma from '../../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central del logo del qr
**/

class QrLogoService {
  async createQrLogo(qrLogoData, qrId) {
    try {
      const qrLogo = await prisma.qrLogo.create({
        data: {
          logo: qrLogoData.logo,
          qrId,
        },
      });
      return qrLogo;
    } catch (error) {
      console.error("Error creating QR logo:", error);
      throw error;
    }
  }
}

export default new QrLogoService();
