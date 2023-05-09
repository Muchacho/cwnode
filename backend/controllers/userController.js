const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient()


const getUserInfo = async(request, response) => {
    try{
        let userId = request.user.user_id
        let user = await prisma.users.findFirst({where:{user_id:userId}, select:{email:true, img_name:true}});
        response.status(200).json({user: user});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getCart = async(request, response) => {
    try{
        let userId = request.user.user_id;
        let bookedTickets = await prisma.bookedtickets.findMany({where:{user_id:userId}});
        response.status(200).json({tickets: bookedTickets});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const changePassword = async (request, response) => {
    try{
        let newPassword = request.body.newPassword;
        console.log(request.user);
        let userId = request.user.user_id;
        let salt = await bcrypt.genSalt(10);
        let hashedNewPassword = await bcrypt.hash(newPassword, salt);
        await prisma.users.update({
            where: {
                user_id : userId
            },
            data: {
                hash_password: hashedNewPassword
            }
        });
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message, 88);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const deleteUser = async (request, response) => {
    try{
        let userId = +request.user.user_id;
        await prisma.bookedtickets.deleteMany({where:{user_id:userId}});
        await prisma.commets.deleteMany({where:{user_id:userId}})
        await prisma.users.delete({where:{user_id:userId}});
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getUserInfo, getCart, changePassword, deleteUser
}