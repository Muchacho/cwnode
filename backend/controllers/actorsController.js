const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const prisma = new PrismaClient()

const getActor = async (request, response) => {
    try{
        let actor = await prisma.actors.findFirst({where:{actors_id:+request.params['id']}});
        response.status(200).json({actor: actor});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addActor = async (request, response) => {
    try{
        let {firstName, lastName, description, birthday_date, theaterId} = request.body;
        if(!firstName || !lastName || !description || !birthday_date || !theaterId)
            return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        let date = new Date(birthday_date);
        await prisma.actors.create({
            data: {
                firstname: firstName,
                lastname: lastName,
                description: description,
                birthday_date: date,
                theater_id: +theaterId
            }
        })
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updActor = async (request, response) => {
    try{
        let {firstName, lastName, description, birthday_date, actorsId} = request.body;
        if(!firstName || !lastName || !description || !birthday_date || !actorsId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        let date = new Date(birthday_date);
        await prisma.actors.update({
            where:{
                actors_id:actorsId
            },
            data:{
                firstname:firstName,
                lastname:lastName,
                description:description,
                birthday_date:date
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const delActor = async (request, response) => {
    try{
        let actorsId = request.body.actorsId;
        console.log(request.body);
        if(!actorsId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.actors.delete({where:{actors_id:actorsId}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getActor, addActor, updActor, delActor
}