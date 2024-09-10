import { Router } from "express";

// Simulación de base de datos
const storeData = {
    '1': {
        selectedOptions: [
            { value: 'Google Play Store', url: 'https://play.google.com', textTop: 'GET IT ON', textBottom: 'Google Play' },
            { value: 'App Store', url: 'https://apple.com', textTop: 'Download on the', textBottom: 'App Store' },
            
            // ... otras opciones
        ],
        backgroundColor: 'linear-gradient(180deg, rgb(253, 93, 8) 0.00%,rgb(251, 164, 14) 100.00%)',
        borderColor: 'rgb(42, 40, 40)',
        image: '',
        titleColor: 'rgb(6, 35, 254)',
        descriptionColor: 'rgb(42, 40, 40)',
        title: '¡Bienvenidos a Mesadoko!',
        description: 'Juega sudoko con palabras mientras te diviertes y aprendes. Juega sudoko con palabras mientras te diviertes y aprendes, Juega sudoko con palabras mientras te diviertes y aprendes Juega sudoko con palabras mientras te diviertes y aprendes, Juega sudoko',
        boxColor: "rgb(216, 61, 34)",
    },
    '2': {
      selectedOptions: [
          { value: 'deezer', url: 'https://soundcloud.com' },
          { value: 'soundcloud', url: 'https://soundcloud.com' },
          // ... otras opciones
      ],
      backgroundColor: 'linear-gradient(180deg, rgb(340, 93, 8) 0.00%,rgb(100, 60, 14) 100.00%)',
      borderColor: '#000000',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFSV4bhdtvdDcYLu7aElxiHHvw1ReH5EsZWA&s',
      titleColor: '#ff0000',
      descriptionColor: '#00ff00',
      title: 'Título de Ejemplo',
      description: 'Descripción de Ejemplo',
      boxColor: "rgb(216, 61, 34)",
  }
    // ... otras entradas
  };

const router = Router();

// Ruta para obtener los valores del formulario de store por ID
router.get('/store/:id', (req, res) => {
    const id = req.params.id;
    const data = storeData[id];
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Datos no encontrados' });
    }
});

export default router;