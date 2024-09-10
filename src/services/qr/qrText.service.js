import prisma from '../../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central del texto del qr
**/

class QrTextService {
  async createQrTextElements(qrTextData, qrTextBubble, qrTextFamily, qrId) {
    try {
      let qrTextFont = await prisma.qrTextFont.findFirst({
        where: {
          fontFamily: {
            equals: qrTextFamily.fontFamily,
          },
        },
      });
  
      if (!qrTextFont) {
        qrTextFont = await prisma.qrTextFont.create({
          data: { fontFamily: qrTextFamily.fontFamily },
        });
      }
  
      // Encuentra o crea qrTextBubble
      let qrTextBubbleRecord = await prisma.qrTextBubble.findFirst({
        where: {
          bubble: {
            equals: qrTextBubble.bubble,
          },
        },
      });
  
      if (!qrTextBubbleRecord) {
        qrTextBubbleRecord = await prisma.qrTextBubble.create({
          data: {
            bubble: qrTextBubble.bubble,
            color: qrTextBubble.color,
          },
        });
      }
  
      // Upsert qrText
      const qrText = await prisma.qrText.upsert({
        where: { qrId }, // Asegúrate de que qrId es único en qrText
        update: {
          text: qrTextData.text || undefined,
          position: qrTextData.position || undefined,
          colorText: qrTextData.colorText || undefined,
          qrTextFontId: qrTextFont.id,
          qrTextBubbleId: qrTextBubbleRecord.id,
        },
        create: {
          text: qrTextData.text || undefined,
          position: qrTextData.position || undefined,
          colorText: qrTextData.colorText || undefined,
          qrTextFontId: qrTextFont.id,
          qrTextBubbleId: qrTextBubbleRecord.id,
          qrId,
        },
      });
  
      return qrText;
    } catch (error) {
      console.error("Error creating or updating QR text elements:", error);
      throw error;
    }
  };
}

export default new QrTextService();
