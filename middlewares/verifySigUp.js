const User=require('../models/User')

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try{
        const user=await User.findOne({
            $or:[{
                username:req.body.username },
            {email: req.body.email}
        ]
    }).exec();
        if(user){
            return res.status(400).json({
                message:'Error usuarios o email ya existe'
            });
        }
        next();
    }catch(err){
        return res.status(500).json({message: err. message});
    }
}

const ckeckRolesExisted = (req, res, next) => {
    if (req.body.roles){
        const validRoeles = ['user', 'admin', 'coordinador', 'auxiliar'];
        for(const validRoeles of req.body.roles){
            if(!validRoeles.includes(role)){
                return res.status(400).send({
                    message: `Error! Rol ${role} no existe!`
                });
            }
        }
    }
};

//Expoetacion de objestos o funciones
module.exports = {
checkDuplicateUsernameOrEmail,
ckeckRolesExisted   
};