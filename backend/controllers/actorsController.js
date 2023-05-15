const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const prisma = new PrismaClient()

const getActor = async (request, response) => {
    try{
        let actor = await prisma.actors.findFirst({where:{actors_id:+request.params['id']}});
        response.status(200).json(actor);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getActorsByTheater = async (request, response) => {
    try{
        let theater_id = +request.params['id']
        let actors = await prisma.actors.findMany({where:{theater_id:theater_id}});
        response.status(200).json(actors);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addActor = async (request, response) => {
    try{
        let regex = new RegExp("^([1-2][0-9]{3})\\-([0-9]{2})\\-([0-9]{2})$");
        let {firstname, lastname, description, birth_date, theater_id} = request.body;
        if(!firstname || !lastname || !description || !birth_date || !theater_id)
            return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(!regex.test(birth_date))return response.status(400).json({message: 'Неверный формат даты'});
        await prisma.actors.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                description: description,
                birth_date: birth_date,
                theater_id: +theater_id
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
        // let {firstName, lastName, description, birthday_date, actorsId} = request.body;
        let {firstname, lastname, description, birth_date, actors_id} = request.body;
        console.log(request.body);
        if(!firstname || !lastname || !description || !birth_date || !actors_id)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.actors.update({
            where:{
                actors_id:actors_id
            },
            data:{
                firstname:firstname,
                lastname:lastname,
                description:description,
                birth_date:birth_date
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
        let actors_id = +request.params['id'];
        console.log(request.body);
        if(!actors_id)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.actors.delete({where:{actors_id:actors_id}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getActor, getActorsByTheater, addActor, updActor, delActor
}