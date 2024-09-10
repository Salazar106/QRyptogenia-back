import { Router } from "express";

// Simulación de base de datos
const musicData = {
    '1': {
        selectedOptions: [
            { value: 'youtube', url: 'https://youtube.com' },
            { value: 'spotify', url: 'https://spotify.com' },
            { value: 'soundcloud', url: 'https://spotify.com' },
            { value: 'deezer', url: 'https://spotify.com' },
            { value: 'apple', url: 'https://spotify.com' },
            // ... otras opciones
        ],
        backgroundColor: 'linear-gradient(180deg, rgb(0, 0, 0) 0.00%,rgb(50, 152, 153) 100.00%)',
        borderColor: '#000000',
        image: 'https://cdn.venngage.com/template/thumbnail/small/679bf7bb-2170-4d54-9485-240baa4ae33c.webp',
        titleColor: '#ffffff',
        descriptionColor: '#000000',
        title: 'Título de Ejemplo',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
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
    }
    // ... otras entradas
};

const socialData = {
    '1': {
        selectedOptions: [
            {value: "facebook"},
            {value: "instagram"},
            {value: "x"}
          ],
        title: "",
        description: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Ciceros De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Ciceros De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:",
        borderColor: "#ffffff",
        backgroundColor: "#E7473C",
        boxColor: "#F0F0F0",
        titleColor: "#820e0e",
        descriptionColor: "#E7473C",
        image: ""
    },
    '2': {
        selectedOptions: [
            {"value": "facebook"},
            {"value": "instagram"},
            {"value": "x"}
          ],
        backgroundColor: 'linear-gradient(180deg, rgb(340, 93, 8) 0.00%,rgb(100, 60, 14) 100.00%)',
        borderColor: '#000000',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFSV4bhdtvdDcYLu7aElxiHHvw1ReH5EsZWA&s',
        titleColor: '#ff0000',
        descriptionColor: '#00ff00',
        title: 'Título de Ejemplo',
        description: 'Descripción de Ejemplo',
    }
    // ... otras entradas
};

const router = Router();

// Ruta para obtener los valores del formulario de música por ID
router.get('/music/:id', (req, res) => {
    const id = req.params.id;
    const data = musicData[id];
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Datos no encontrados' });
    }
});

router.get('/social/:id', (req, res) => {
    const id = req.params.id;
    const data = socialData[id];
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Datos no encontrados' });
    }
});

export default router;