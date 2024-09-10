import prisma from '../../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central del diseño del qr
**/

class QrDesignService {
  async createQrDesign(qrDesignData) {
    try {
      const qrDesign = await prisma.qrDesign.create({
        data: {
          frame: qrDesignData.frame,
          frameColor: qrDesignData.frameColor,
          dots: qrDesignData.dots,
          dotsColor: qrDesignData.dotsColor,
          cornerSquare: qrDesignData.cornerSquare,
          cornerSquareColor: qrDesignData.cornerSquareColor,
          cornerDot: qrDesignData.cornerDot,
          cornerDotColor: qrDesignData.cornerDotColor,
        },
      });
      return qrDesign;
    } catch (error) {
      console.error("Error creating QR design:", error);
      throw error;
    }
  }
}

export default new QrDesignService();
