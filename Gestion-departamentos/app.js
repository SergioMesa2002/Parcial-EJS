const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');


let departamentosJSON = [];
let municipiosJSON = [];


const cargarDatosJSON = () => {
    fs.readFile('./departments.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error departments.json:', err);
            return;
        }
        try {
            departamentosJSON = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al  departments.json:', parseError);
        }
    });

    fs.readFile('./towns.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error  towns.json:', err);
            return;
        }
        try {
            municipiosJSON = JSON.parse(data);
        } catch (parseError) {
            console.error('Error  towns.json:', parseError);
        }
    });
};


cargarDatosJSON();


function obtenerMunicipios(departamento) {
    return municipiosJSON.filter(municipio => municipio.department === departamento);
}


let objetos = [];


app.get('/', (req, res) => {
    res.render('index', { departamentos: departamentosJSON, objetos });
});


app.get('/municipios/:departamento', (req, res) => {
    const departamento = req.params.departamento;
    const municipios = obtenerMunicipios(departamento);
    res.json(municipios);
});


app.post('/agregar', (req, res) => {
    const { carro, placa, departamento, municipio } = req.body;

   
    const departamentoSeleccionado = departamentosJSON.find(dep => dep.code === departamento);

  
    const nuevoCarro = {
        carro,
        placa,
        departamento: departamentoSeleccionado ? departamentoSeleccionado.name : '',
        municipio
    };

    objetos.push(nuevoCarro);
    res.redirect('/');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor  en http://localhost:${PORT}`);
});
