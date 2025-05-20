const Category =require('../models/Category');

exports.createCategory =async(req ,res )=>{
    try{
        const{name,description}=req.body;

        //Validacion 
        if(!name || typeof name !== 'string'|| !name, trim()){
            return res.status(400).json({
                success:false,
                message:'El nombre es oblicatorio y debe ser texto'
            });
        }
        if(!description || typeof description !== 'string' || !description.trim()){
            return res.status(400).json ({
                success:false,
                message: 'La descripcion es oblicatoria y debe ser texto'
            });
        }
    
        const trimedName =name.trim();
        const trimedDesc =description.trim();

        //verificar si ya existe la categoria
        const existingCategoria=await Category.findOne({name:trimedName});
    }

}