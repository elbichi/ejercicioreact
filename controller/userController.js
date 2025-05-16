const db = require('../models/User');
const User = db.User;


exports.allAccess = (req, res) => {//externo
    res.status(200).send("Contenido publico");
};
exports.userBoard =(req, res) => {//seminarista
    res.status(200).send("Contenido Usiario.");
};

exports.adminBoard = (req, res) => {//admin
    res.status(200).send("Contenido Admin.");
};

exports.coordinadorBoard = (req, res) => {//tesorero
    res.status(200).send("Contenido Coordinador.");
};

exports.auxiliarBoard = (req, res) => {//logistica
    res.status(200).send("Contenido Auxiliar.");
};

