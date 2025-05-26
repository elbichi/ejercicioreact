module.exports={
    secret: process.env.JWT_SECRET || '123456',
    jwtExpiration: 86400, // 24 horas
    jwRefeshExpiration: 604800, // 7 dias
};