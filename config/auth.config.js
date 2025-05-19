module.exports={
    secret:process.env.JWT_SECRET || '12345',
    jwtExpiration: process.env.JWT_EXPIRE || '24h'
    
};