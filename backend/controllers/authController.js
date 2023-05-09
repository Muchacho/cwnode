const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const login = async (request, response)=>{
    try{
        let {email, password} = request.body;

        if(!email || !password)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});

        let user = await prisma.users.findFirst({where:{
            email: email
        }});

        const isPasswordCorrect = user && (await bcrypt.compare(password, user.hash_password));

        if(isPasswordCorrect){
            response.status(200).json({
                id:user.user_id,
                email:user.email,
                role: user.role,
                token: jwt.sign({id:user.user_id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '10m'})
            });
        } else {
            return response.status(400).json({message:"Неверный email или пароль"});
        }
    } catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const register = async (request, response)=>{
    try{
        let {email, password} = request.body;

        if(!email || !password)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});

        if(await prisma.users.findUnique({where:{email:email}})){
            return response.status(400).json({message: 'Пользователь уже существует'});
        }
        
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let user = await prisma.users.create({
            data:{
                email,
                hash_password: hashedPassword,
                role: 'client'
            }
        })
        if(user){
            return response.status(201).json(jwt.sign({id:user.user_id, role:user.role}, process.env.JWT_SECRET, {expiresIn: '10m'}));
        } else {
            return response.status(500).json({message:'Не удалось создать пользователя'});
        }
    }
    catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}


module.exports = {
    login, register
}