const Product = require('../models/Products'); // Cambia Product a Products
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, Category, subcategory } = req.body;

        //Validacion de campos requeridos

        if (!name || !description || !price || !stock || !Category || !subcategory) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        //Verifican que la categoria exista

        const categoryExists = await Category.findById(Category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'La categoria esepsifica no existe'
            });
        }
        //Verificar que la subcategoria existe y pertenezca a la categoria
        const subcategoryExists = await Subcategory.findOne({
            _id: subcategory,
            category: Category // Cambiado a Category
        });

        if (!subcategoryExists) {
            return res.status(400).json({
                success: false,
                message: 'La subcategoria no existe o no pernetenece a la categoria'
            });
        }

        //Crear el producto sin el createBy temporalmente
        const product = new Product({
            name,
            description,
            price,
            stock,
            category: Category, // Cambiado a Category
            subcategory
            //CreatedBy se agrega 
        });

        //Verifica si el usuaro esta disponible en el request

        if (req.user && req.user.id) {
            product.createdBy = req.user.id;
        }

        //Guardar en la base de datos

        const savedProduct = await product.save();


        //Obtener el producto con los datos poblados
        const productWithDetails = await Product.findById(savedProduct._id).populate('category', 'name').populate('subcategory', 'name');
        res.status(201).json({
            success: true,
            message: ('producto creado exitosamente'),
            data: productWithDetails
        });
    } catch (error) {
        console.error('Error en createdProduct:', error);

        //Manejo de errores en mongoDB
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }

};
//Consulta de productos  GET api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name').populate('subcategory', 'name').sort({ createAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('')
        console.error('error de getprocducts ', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos'
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name description').populate('subcategory', 'name description');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'producto no encontrado '
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error en getProductById', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto'
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subcategory } = req.body;
        const updateData = {};

        //validar y preparar datos para actualizacion
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (stock) updateData.stock = stock;
        //validar relaciones si se actualizan
        if (category || subcategory) {
            if (category) {
                const categoryExists = await Category.findById(category);
                if (!categoryExists) {
                    return res.status(404).json({
                        success: false,
                        message: 'La categoria especifica no existe'
                    });
                }
                updateData.category = category;
            }
            if (subcategory) {
                const subcategoryExists = await Subcategory.findOne({
                    _id: subcategory,
                    category: category || updateData.category
                });
                if (!subcategoryExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'La subcategoria no existe o no pertenese a la categoria '
                    });
                }
                updateData.subcategory = subcategory;
            }
        }

        //actualizar el producto
        const updateProduct = await Product.finByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('category', 'name')
            .populate('subcategory', 'name');

        if (!this.updateProduct) {
            return res.status(404).json({
                success: false,
                message: 'producto no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'producto actilizado exitosamente',
            data: updateProduct
        });


    } catch (error) {
        console.error('Error en updateaproduct:', error);
        req.status(500).json({
            success: false,
            message: 'Error al actualizar el producto'
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'producto no encontrado '
            });

        }
        res.status(200).json({
            success: true,
            message: 'porducto eliminado exitosamente',
            data: product
        });
    } catch (error) {
        console.error('Error en deleteProduct', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto'
        });
    }

};