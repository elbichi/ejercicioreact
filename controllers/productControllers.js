const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.createProduct = async(req, res)=>{
    try{
        const{name, description, price, stock, Category, subcategory} = req.body;

        //Validacion de campos requeridos

        if(!name || !description || !price || !stock ||!Category ||!subcategory){
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        //Verifican que la categoria exista

        const categoryExists = await Category.finById(Category);
        if (!categoryExists){
            return res.status(404).json({
                success: false,
                message:'La categoria esepsifica no existe'
            });
        }
        //Verificar que la subcategoria existe y pertenezca a la categoria
        const subcategoryExists = await Subcategory.findOne({
            _id: subcategory,
            category: category
        });

        if(!subcategoryExists){
            return res.status(400).json({
                success:false,
                message:'La subcategoria no existe o no pernetenece a la categoria'
            });
        }

        //Crear el producto sin el createBy temporalmente
        const product = new Product({
            name, 
            description,
            price,
            stock,
            category,
            subcategory
            //CreatedBy se agrega 
        });

        //Verifica si el usuaro esta disponible en el request

        if(req.user && req.user.id){
            product.createdBy = req.user.id;
        }

        //Guardar en la base de datos

        const savedProduct = await product.save();


        //Obtener el producto con los datos poblados
        const productWithDetails = await Product.finById
        (savedProduct._id)
        .populate('category', 'name')
        .populate('subcategory', 'name');

        res.status(201).json({
            success: true,
            message:('producto creado exitosamente'),
            data: productWithDetails
        });
    }catch(error){
        console.error('Error en createdProduct:', error);

        //Manejo de errores en mongoDB
        if (error.code === 11000){
        return res.status(400).json({
            success: false,
            message:'Ya existe un producto con ese nombre'
        });
    }

    res.status(500).json({
        success: false,
        message:'Error al crear el producto',
        error: error.message
    });
    }

};
//Consulta de productos  GET api/products
exports.getProducts = async (req, res)=>{
    try{
        const products = await Product.find()
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .sort({createAt: -1});

        res.status(200).json({
            success:true,
            count: products.length,
            data: products
        });
    }catch(error){
        console.error('')
    }
}