const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authJwt } = require('../middlewares');

// Asegúrate de que todas las rutas usen controladores válidos
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.post('/', [authJwt.verifyToken], categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;