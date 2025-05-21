const Subcategory= require('../models/Subcategory');
const Category = require('../models/Category');

//Crear sub categoria
exports.createSubcategory = async(req, res)=>{
    try{
        const{name, description, category} = req.body;

        //Validar que la categoria exista
        const parentCategory = await Category.findById(category);
        if(!parentCategory){
            return res.status(404).json({
                success: false,
                message: 'La categoria no existe'
            });
        }

        const newSubcategory = new Subcategory({
            name: name.trim(),
            description: description.trim(),
            category
        });
        await newSubcategory.save();

        res.status(201).json({
            success: true,
            message:'Subcategoria creada existosa mente',
            data: newSubcategory
        });
    }catch(error){
        console.error('Error al crear la subcategoria:',err);


        if(error.message.includes('duplicate  key')|| error.message.includes('Ya existe')){
            return res.status(400).json({
                success: false,
                message: 'Ya existe una subcategoria con ese nombre'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear subcategoria'
        });
    }
    

};

//Obtener todas las subcategorias