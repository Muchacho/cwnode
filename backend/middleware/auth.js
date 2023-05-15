const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const auth = async (request, response, next) => {
    try{
        if(!request.headers["authorization"])return response.status(403).json({message:"Forbidden"});
        let token = request.headers["authorization"].split(' ')[1];
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let user = await prisma.users.findFirst({where:{user_id:data.id}});
        request.user = user;
        next();
    }catch(error){
        console.log(error.message, 123);
        response.status(500).json({message: 'Что-то пошло не так(auth)'});
    }
}

const checkRole = async (request, response, next) => {
    try{
        if(request.user.role != 'admin')return response.status(403).json({message:"Forbidden"});
        next();
    }catch(error){
        console.log(error.message, 123);
        response.status(500).json({message: 'Что-то пошло не так(authadmin)'});
    }
}

module.exports = {
    auth, checkRole
}