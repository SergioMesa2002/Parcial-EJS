const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas EJS
app.set('view engine', 'ejs');

// Cargar departamentos y municipios desde archivos JSON
let departamentosJSON = [];
let municipiosJSON = [];

// Leer archivos JSON con manejo de errores
const cargarDatosJSON = () => {
    fs.readFile('./departments.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer departments.json:', err);
            return;
        }
        try {
            departamentosJSON = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al parsear departments.json:', parseError);
        }
    });

    fs.readFile('./towns.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer towns.json:', err);
            return;
        }
        try {
            municipiosJSON = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al parsear towns.json:', parseError);
        }
    });
};

// Inicializar la carga de datos
cargarDatosJSON();

// Función para obtener municipios por departamento
function obtenerMunicipios(departamento) {
    return municipiosJSON.filter(municipio => municipio.department === departamento);
}

// Array para almacenar los carros agregados
let objetos = [];

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { departamentos: departamentosJSON, objetos });
});

// Ruta para obtener municipios de un departamento específico
app.get('/municipios/:departamento', (req, res) => {
    const departamento = req.params.departamento;
    const municipios = obtenerMunicipios(departamento);
    res.json(municipios);
});

// Ruta para manejar el envío del formulario
app.post('/agregar', (req, res) => {
    const { carro, placa, departamento, municipio } = req.body;
    const nuevoCarro = { carro, placa, departamento, municipio };
    objetos.push(nuevoCarro);
    res.redirect('/');
});

// Servidor en puerto configurado en variables de entorno o por defecto en 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
