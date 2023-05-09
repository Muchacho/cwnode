const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const getAll = async (request, response) => {
    try{
        let shows = await prisma.shows.findMany();
        response.status(200).json({shows: shows});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getShow = async (request, response) => {
    try{
        let show = await prisma.shows.findFirst({where:{theater_id:+request.params['id']}});
        let schedule = await prisma.schedule.findMany({where:{show_id:show.show_id}});
        let theates = await prisma.theaters.findMany({where:{theater_id:schedule.theater_id}});
        let areas = await prisma.acting_area.findMany({where:{area_id:schedule.area_id}});
        response.status(200).json({show:show,schedule:schedule,theates:theates,areas:areas});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addShow = async (request, response) => {
    try{
        let {name, description, duration} = request.body;
        if(!name || !description || !duration)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(await prisma.shows.findFirst({where:{name:name}})) return response.status(400).json({message: 'Представление с таким именем уже существует'});
        let result = await prisma.shows.create({
            data: {
                name: name,
                description: description,
                duration: duration,
                rating: null
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const deleteShow = async (request, response) => {
    try{
        let showId = request.body.showId;
        console.log(request.body);
        if(!showId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.shows.delete({where:{show_id:showId}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateShow = async (request, response) => {
    try{
        let {showId, name, description, duration} = request.body;
        if(!showId || !name || !description || !duration)return response.status(400).json({message: 'Пожалуйста, заполните обязательные пол1я'});
        await prisma.shows.update({
            where:{
                show_id:showId
            },
            data:{
                name:name,
                description:description,
                duration:duration
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getAll, getShow, addShow, deleteShow, updateShow
}