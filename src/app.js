import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import session from 'express-session';
import { CorsConfig } from './lib/cors.config.js';
import morgan from 'morgan';
import multer from 'multer';
import { boomErrorHandler, errorHandler, logError } from './middleware/error.handler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import i18n from 'i18n';

const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '/lenguages'),
  defaultLocale: 'en',
  // Más configuraciones según tus necesidades
});

app.use(i18n.init);

// Middleware para manejar JSON en el cuerpo de las solicitudes
app.use(express.json({ limit: '50mb' }));
app.use(cors(CorsConfig));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(upload.single('profile_picture'));
app.use(session({
    secret: 'jDZk8F3nYs5pRQaW',
    resave: false,
    saveUninitialized: false
  }));
app.use("/api", routes);
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.post('/api/set-language', (req, res) => {
  const { language } = req.body;

  if (['en', 'es'].includes(language)) {
    // Aquí puedes guardar el idioma en una base de datos o en algún otro lugar
    // Por ejemplo, para el usuario autenticado:
    // req.user.language = language;
    // req.user.save();

    // Log para verificar el idioma recibido
    console.log(`Idioma recibido: ${language}`);
    
    // Establecer el idioma en i18n para futuras solicitudes
    i18n.setLocale(language);
    console.log('sdsdddd', i18n)
    // Responder al cliente
    res.json({ message: 'Idioma actualizado con éxito', language });
  } else {
    res.status(400).json({ message: 'Idioma no soportado' });
  }
});

app.get('/api/some-endpoint', (req, res) => {
  const language = req.user?.language || 'en'; // O obtener del request o base de datos
  i18n.setLocale(language);
  const message = i18n.__('welcomeMessage'); // Ejemplo de uso de traducción

  // Log para verificar el idioma actual y el mensaje traducido
  console.log(`Idioma actual: ${language}`);
  console.log(`Mensaje traducido: ${message}`);

  res.json({ message });
});

// Configuración de middlewares y rutas


export default app;
