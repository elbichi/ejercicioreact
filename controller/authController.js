const User=require('../models/User');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


//funcion de registro
exports.singnup = async (req, res)=> {
    try {
        const {username,email,password} =req.body;

        //validacion 
        if(!username || !email || !password){
            return res.status(400).json({
                message : 'Todos los campos son obligatorios'
            });
        }

        //crear usuario sin hashear dejamos que el modelo lo haga

        const user = new User({
            username,
            email,
            password, // se hasheara automaticamente en el pre-save hook
            roles: req.body.roles || ['auxiliar']
        
        });
        //guardar Usuarios
        await user.save();
        //general token
        const token =jwt.sing({id: user._id}.
        config.secret, {
            expiresIn: config.jwtExpiration
        });
        
        //peprara respuesta
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'usuarios registrado correctamente',
            user: userReponse,
            accessToken: token
        });
    }catch (error){
        console.error('Error de registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message,
        });
    }
};

//funcion de login
exports.signin= async(req,res)=>{
try{
    const {username,password}=req.body;
    console.log('intento de login para: ', username , 'con pass', password);
    const user=await User.findOne({username}.select('+password'));
    if(!user){
        console.log('usuario no encontrado en DB');
        return res.status(404).json({
            success: false,
            message: 'usuario no encontrado',
        });

    }
    // debug: mostrar hash almacenado

    console.log('hash almacenado', user.password);
    //compraracion directa con ccrypt

    const isMatch = await bcript.compare(password, user.password);
    console.log('resultado de compraracion', isMatch);

    if(!isMatch){
        // debug contraseña
        const testHash = await bcrypt.hash(password, user.password.substring(0, 29));
        console.log('Hash recalculado', testHash);
        console.log('conside con el alccenado?', testHash === user.password);
        return res.status(401).json({
            susccess: false,
            accessToken: null,
            message: 'Creadenciales incorrectas'
        });
    }

    //Generador token JWT

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            roles: user.roles
        },
        config.secret,
        {expiresIn: config.jwtExpiration,}
    );
        res.status(200).json({
            success: true,
            message: 'Inicio de sesion exitoso',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            },
            accessToken: token
        });
} catch (error) {
        //error coregido
    console.error('Error en el login:', error);
    res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message,
    });
    }
};  
// Removed redundant catch block at the end of the function
