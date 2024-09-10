import boom from '@hapi/boom';
import prisma from '../../lib/prisma.js';
import QrDesignService from './qrDesign.service.js';
import QrTypeService from './qrType.service.js';
import QrLogoService from './qrLogo.service.js';
import QrPreviewService from './qrPreview.Service.js';
import QrTextService from './qrText.service.js';
import { getDate } from '../../utils/dateUtils.js';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:45:12
 * @description : Refactorizacion, servicio central del qr
**/

class QrService {
  
  constructor(qrDesignService, qrTypeService, qrLogoService, qrPreviewService, qrTextService) {
    this.qrDesignService = qrDesignService;
    this.qrTypeService = qrTypeService;
    this.qrLogoService = qrLogoService;
    this.qrPreviewService = qrPreviewService;
    this.qrTextService = qrTextService;
  }

  async createQr(qrData, userId) {
    const dateCurrent = getDate();

    if (qrData.qr.qrName && qrData.qr.qrName.length > 30) {
      throw boom.badRequest("QR code name must be less than 30 characters");
    }

    try {
      const newQR = await prisma.$transaction(async (prisma) => {
        // Create QR Design and Type
        const qrDesign = await this.qrDesignService.createQrDesign(qrData.qrDesign);
        const qrType = await this.qrTypeService.getQrType(qrData.qr.qrType);

        // Generate or use provided QR name
        let qrName = qrData.qr.qrName;
        if (!qrName || typeof qrName !== "string") {
          qrName = await this.generateUniqueName(userId);
        }

        // Create the QR record
        const newQR = await prisma.qr.create({
          data: {
            name_qr: qrName,
            createdAt: dateCurrent,
            userId: userId,
            qrDesignId: qrDesign.id,
            qrTypeId: qrType.id,
            qr_image_base64: qrData.qrBase64,
          },
        });

        // Update QR with generated data value
        const qrDataValue = this.generateQrDataValue(qrType, qrData, newQR.id);
        const updatedQR = await prisma.qr.update({
          where: { id: newQR.id },
          data: { qr: qrDataValue },
        });

        return newQR;
      });

      // Handle related data creation in a separate transaction
      const relatedData = await prisma.$transaction(async (prisma) => {
        let qrLogo = null;
        let qrPreview = null;
        let qrText = null;

        // Create QR Logo if data is provided
        if (qrData.qrLogo && qrData.qrLogo.logo) {
          qrLogo = await this.qrLogoService.createQrLogo(qrData.qrLogo, newQR.id);
        }

        // Create QR Preview
        qrPreview = await this.qrPreviewService.createQrPreview(qrData.qrPreview, newQR.id);

        // Create QR Text if data is provided
        if (qrData.qrText && qrData.qrText.text !== "") {
          qrText = await this.qrTextService.createQrTextElements(qrData.qrText, qrData.qrTextBubble, qrData.qrTextFont, newQR.id);
        }

        return {
          qrLogo,
          qrPreview,
          qrText,
        };
      });

      return {
        newQR,
        ...relatedData,
      };
    } catch (error) {
      console.error("Error creating QR code and related data:", error);
      throw boom.internal("Failed to create QR code and related data");
    }
  }

  async generateUniqueName(userId) {
    try {
      let uniqueName = "";
      let exists = true;

      while (exists) {
        uniqueName = `QR_${Math.floor(Math.random() * 10000)}`;
        const existingQR = await prisma.qr.findFirst({
          where: {
            name_qr: uniqueName,
            userId,
          },
        });
        exists = existingQR ? true : false;
      }

      return uniqueName;
    } catch (error) {
      console.error("Error generating unique QR name:", error);
      throw boom.internal("Error generating unique QR name");
    }
  }

  generateQrDataValue(qrType, qrData, qrId) {

    if (!qrType || !qrType.type) {
      console.warn("qrType is not provided or does not have a type property");
      // Proporcionar un valor por defecto o manejar la ausencia de qrType
      return qrData.qr?.data || ""; // Retorna qrData.qr.data o una cadena vacía si qrData.qr o qrData.qr.data es undefined
    }
  
    let qrDataValue = qrData.qr.data;
    console.log('asdasdasda',qrType);
    
    if (qrType.type !== "website-url" && qrType.type !== "pdf") {
      const serverUrl = "http://localhost:5173/qr/scan";
      qrDataValue = `${serverUrl}?q=${qrId}`;
    }

    return qrDataValue;
  }
}

export default new QrService(
    QrDesignService,
    QrTypeService,
    QrLogoService,
    QrPreviewService,
    QrTextService
);
