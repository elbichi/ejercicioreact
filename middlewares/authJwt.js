const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models/User");
const User = db.User;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.satus(403).send({ message: "no se proporciono el token" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.satus(401).send({ message: "no autorizado!" });
    }
    req.UserId = decoded;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req, UserId).exce((err, User) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (User.roles.include("admin")) {
      next();
      return;
    }
    res.status(403), send({ message: "requiere rol Admin" });
  });
};

isCorordinador=(req,res,next) =>{
  User.findById(req.UserId).exce((err,user)=> {
    if (err){
      res.status(500).send({messenger: err});
      return;
    }

    if (user.roles.include('coordinador')){
      next();
    return;
    }
    res.satus(403).send({message:'requiere rol de coodinador '});
  });

};
isAuxiliar=(req,res,next) =>{
  User.findById(req.UserId).exce((err,user)=> {
    if (err){
      res.status(500).send({messenger: err});
      return;
    }

    if (user.roles.include('auxiliar')){
      next();
    return;
    }
    res.status(403).send({message:'requiere rol de auxiliar '});
  });

};

const authJwt={
  verifyToken,
  isAdmin,
  isCorordinador,
  isAuxiliar
};

module.exports={
  verifyToken,
  isAdmin,
  isCorordinador,
  isAuxiliar
};

