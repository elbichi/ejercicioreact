const Category =require('../models/Category');

exports.createCategory =async(req ,res )=>{
    try{
        const{name,description}=req.body;

        //Validacion 
        if(!name || typeof name !== 'string'|| !name, trim()){
            return res.status(400).json({
                success:false,
                message:'El nombre es oblicatorio y debe ser texto valido'
            });
        }
        if(!description || typeof description !== 'string' || !description.trim()){
            return res.status(400).json ({
                success:false,
                message: 'La descripcion es oblicatoria y debe ser texto valido'
            });
        }
    
        const trimedName =name.trim();
        const trimedDesc =description.trim();

        //verificar si ya existe la categoria
        const existingCategoria=await Category.findOne({name:trimedName});
        if(existingCategoria){
        return res.status(400).json({
            success: false,
            message:'ya existe una catehoria con ese nombre' 

        });
    }

    const newCategory = new Categorye({
        name: trimedName,
        description: trimedDesc  
    });
    await newCategory.save();
    res.status(201).json({
        success: true,
        message: 'categoria creada con exito',
        category: newCategory
    });
    } catch (error) {
        console.error('error en createCategory:', error);

        //manejo especifico de error de duplicados
        if (error.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'ya existe una categoria con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear caregoria',
            error: error.message
        });
    }
};

exports.getCategories=async(req, res)=>{
    try{
        const categories = await Category.find().sort({createdAt: -1});
        res.status(200).json({
            success: true,
            data: categories,
    
        });
    }catch (error){
        console.error('Error en getCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias'
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category =await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }
        res.status(200),json({
            success: true,
            data: category
        });

    }catch (error){
        console.error('Error en getCategoryById', error);
        res.status(500).json({
            success:false,
            message: 'Error al obtener la categoria  '
        });
    }

};

exports.updateCategory =async(req, res)=>{
    try{
        const {name, descripcion}=req.body;
        const updateData={};
        if (name){
            updateData,name = name.trim();
            //verificar si el nuevo nombre ya existe 
            const existing =await Category.findOne({
                name: updateData.name,
                _id: {$ne: req.params.id}
            });
        if (existing){
            return res.status(400),json({
                success: false,
                message: 'ya existe una categoria con ese nombre'

            });
        }
    }
        if(descripcion){
            updateData.descripcion = descripcion.trim();
        }
        const updateCategory =await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true, runValidators: true}
        );
        if(!updateCategory){
            return res.status(404).json({
                success: false,
                message: 'Categoria no encotrada'
            });
        }
    res.status(200).json({
        success:true,
        message: 'Categoria actuaizada ',
        data : updateCategory
    });
    }catch (error){
        console.error('Error en updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoria '
        });
    }
};

exports.deleteCategory = async (req, res)=>{
    try{
        const deleteCategory =await Category.findByIdAndDelete(req.params.id);
        if(!deleteCategory){
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontraba'
            });

        }
        res.status(200).json({
            success:true,
            message: 'Categoria eliminada'
        });
    }catch (error){
        console.error('Error en deleteCategory', error)
        res.status(500).json({
            success:false,
            message: 'Error al eliminar categoria'
        });
    }
};
