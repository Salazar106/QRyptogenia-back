import prisma from '../../lib/prisma.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central de la preview del qr
**/

class QrPreviewService {
  async createQrPreview (qrPreviewData, qrId){
  try {
    const qrPreview = await prisma.qrPreview.upsert({
      where: { qrId }, // Busca el registro existente por qrId
      update: {
        title: qrPreviewData.title || undefined,
        colorTitle: qrPreviewData.colorTitle || undefined,
        description: qrPreviewData.description || undefined,
        descriptionColor: qrPreviewData.descriptionColor || undefined,
        boxColor: qrPreviewData.boxColor || undefined,
        borderImg: qrPreviewData.borderImg || undefined,
        imgBoxBackgroud: qrPreviewData.imgBoxBackgroud || undefined,
        backgroudColor: qrPreviewData.backgroudColor || undefined,
        SelectOptions: qrPreviewData.SelectOptions || undefined,
      },
      create: {
        title: qrPreviewData.title || undefined,
        colorTitle: qrPreviewData.colorTitle || undefined,
        description: qrPreviewData.description || undefined,
        descriptionColor: qrPreviewData.descriptionColor || undefined,
        boxColor: qrPreviewData.boxColor || undefined,
        borderImg: qrPreviewData.borderImg || undefined,
        imgBoxBackgroud: qrPreviewData.imgBoxBackgroud || undefined,
        backgroudColor: qrPreviewData.backgroudColor || undefined,
        SelectOptions: qrPreviewData.SelectOptions || undefined,
        qrId,
      },
    });
    return qrPreview;
  } catch (error) {
    console.error("Error upserting QR preview:", error);
    throw error;
  }
};
}

export default new QrPreviewService();
