import request from 'supertest';
// La biblioteca supertest para realizar solicitudes HTTP durante las pruebas
import app from '../src/app.js';

/**
 * @Author : Jobserd Julián Ocampo, @date 2024-08-13 09:39:19
 * @titulo : Pruebas unitarias para la creacion de qr
 * @description : Prueba para la API de QR que verifica la funcionalidad de guardar un nuevo QR. Utiliza supertest para enviar una solicitud POST y verifica la respuesta.
 * @nota : IMPORTANTE HACER LOS AJUSTES DE LAS PRUEBAS PARA EL MODELO ACTUAL DEL QR
**/

// Se define el conjunto de pruebas 
describe('QR API', () => {
  it('should save a new QR', async () => {
    const userId = '74710b33-4436-4fbc-b9c6-97d35abd7ed5';

    const qrData = {
      qr: { qrType: 'website url', data: 'http://ejemplooo.com' },
      qrDesign: { frame: 'square', frameColor: 'black', dots: 'square', dotsColor: 'blue', cornerSquare: 'square', cornerSquareColor: 'black', cornerDot: 'square', cornerDotColor: 'blue' },
      qrLogo: { logo: 'logo.png', size: 50 },
      qrPreview: { title: 'QR Code', colorTitle: 'black', description: 'Description', descriptionColor: 'black', boxColor: 'white', borderImg: 'http://example.com/border.png', imgBoxBackgroud: 'http://example.com/background.png', backgroudColor: 'white', SelectOptions: 'Option1' },
      qrText: { text: 'Sample Text', positionX: 10, positionY: 10, colorText: 'black', fontSize: 12 },
      qrTextFont: { fontFamily: 'Arial' },
      qrTextBubble: { burbble: 'bubble', color: 'blue' },
    };
    // Realizamos una solicitud POST a la ruta /api/qr/save con los datos definidos
    const response = await request(app)
      .post('/api/qr')
      .send({ qrData, userId })  
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.message).toEqual('QR saved successfully');
  });
});

// supertest: APIs HTTP en aplicaciones Node.js
// jest: Crea, ejecuta y estructura las pruebas
