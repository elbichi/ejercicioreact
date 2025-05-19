const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserShema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    roles:[{type: String, enum:['admin', 'coordinador', 'auxiliar']}]
    }, {
        timestamps: true,
    //desactive la notificacion de id
    versionKey: false,
    toJSON:{virtuals: true},
    toObject: {virtuals:true}
    }
);


//hook pre-save
UserShema.pre('save', async function (next){

    //solo hasshear si la contraseña  fue modificada

    if(!this.isModified('password')) return next();

    try{
        console.log('Contraseña antes de hasear', this.password);
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Contraseña hasheada:',
            this.password
        );
        next();
    } catch(err){
    console.error('Error al hasshear:',err);
next(err);
}
    
});

//metodo para compara contraseñas 

UserShema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
};

module.exports =mongoose.model('User', UserShema);
