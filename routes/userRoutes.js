const express = require('express');
const router = express.Router();
const {authJwt} = require('../middlewares');
const userController = require('../controller/userController');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers","x-access-token, origin, Content-type, Accept");
    next();
});

router.get('/all', userController.allAccess);
router.get('/user',[authJwt.verifyToken], userController.userBoard);
router.get('/admin',[authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get('/coordinador',[authJwt.verifyToken, authJwt.isCoordinador], userController.coordinadorBoard);
router.get('/auxiliar',[authJwt.verifyToken, authJwt.isAuxiliar], userController.auxiliarBoardBoard);

module.exports = router;