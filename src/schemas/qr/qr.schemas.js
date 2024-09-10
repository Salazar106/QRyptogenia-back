import Joi from 'joi';

/**
 * @Author : Jobserd Julián Ocampo,   @date 2024-08-10 16:53:27
 * @description : Esquema dedicado a la validacion de los datos del qr, usando en el metodo de creacion del qr por parte del usuario
**/

// Esquema para validar el qrTextFont
const qrTextFontSchema = Joi.object({
    fontFamily: Joi.object().required() 
});

// Esquema para validar el qrTextBubble
const qrTextBubbleSchema = Joi.object({
    bubble: Joi.object({ 
        borderRadius: Joi.string().required(),
        padding: Joi.string().required(),
        backgroundColor: Joi.string().optional()
    }).required(),  
    color: Joi.string().required()
});

// Esquema para validar el qrText
const qrTextSchema = Joi.object({
    text: Joi.string().allow('', null).optional(),  
    position: Joi.object().required(),
    colorText: Joi.string().required()
});

// Esquema para validar el qrLogo
const qrLogoSchema = Joi.object({
    logo: Joi.string().allow('', null).optional() 
});

// Esquema para validar el qrDesign
const qrDesignSchema = Joi.object({
    frame: Joi.string().required(),
    frameColor: Joi.string().required(),
    dots: Joi.string().required(),
    dotsColor: Joi.string().required(),
    cornerSquare: Joi.string().required(),
    cornerSquareColor: Joi.string().required(),
    cornerDot: Joi.string().required(),
    cornerDotColor: Joi.string().required()
});

// Esquema para validar el qrPreview
const qrPreviewSchema = Joi.object({
    title: Joi.string().optional(),
    colorTitle: Joi.string().required(),
    description: Joi.string().required(),
    descriptionColor: Joi.string().required(),
    boxColor: Joi.string().required(),
    borderImg: Joi.string().required(),
    imgBoxBackgroud: Joi.string().optional(),
    backgroudColor: Joi.string().required(),
    SelectOptions: Joi.array().optional()
});

// Esquema para validar el qrInner
const qrInnerSchema = Joi.object({
    qrName: Joi.string().allow('', null), // Puede ser opcional o vacío
    data: Joi.string().allow('', null).optional(),  
    qrType: Joi.string().required(),
    qrColor: Joi.string().required(),
    qrBgColor: Joi.string().required()
});

// Esquema principal para validar todos los datos
const qrDataSchema = Joi.object({
    qr: qrInnerSchema.required(),
    qrPreview: qrPreviewSchema.required(),
    qrText: qrTextSchema.required(),
    qrTextFont: qrTextFontSchema.required(),
    qrTextBubble: qrTextBubbleSchema.required(),
    qrDesign: qrDesignSchema.required(),
    qrLogo: qrLogoSchema.required(),
    qrBase64: Joi.string().required() 
});

export { qrDataSchema };
