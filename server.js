require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app =express();


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//coneccion mongo

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lukas')
.then(() => console.log('ok conexion a MongoDB exitosa'))
.catch(err => console.error('x error de conexion a MongoBD: ',err));


//Importacion de rutas
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require ('./routes/userRoutes');

//configuracion de rutas
app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

//puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});