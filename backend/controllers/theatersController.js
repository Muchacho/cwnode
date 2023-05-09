const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const getAll = async (request, response) => {
    try{
        let theaters = await prisma.theaters.findMany();
        response.status(200).json({theaters: theaters});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTheater = async (request, response) => {
    try{
        let theater = await prisma.theaters.findFirst({where:{theater_id:+request.params['id']}});
        let actors = await prisma.actors.findMany({where:{theater_id: theater.theater_id}});
        response.status(200).json({theater: theater, actors: actors});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getAllTheaterInfo = async (request, response) => {
    try{
        let theater = await prisma.theaters.findFirst({where:{theater_id:+request.params['id']}});
        let actors = await prisma.actors.findMany({where:{theater_id: theater.theater_id}});
        let showsId = await prisma.theaters_shows.findMany({where:{theater_id:theater.theater_id}});
        let areas = await prisma.acting_area.findMany({where:{theater_id:theater.theater_id}});
        let shows = [];
        if(showsId.length > 0){
            for(let item in showsId){
                shows[item] = await prisma.shows.findFirst({where:{show_id:showsId[item].show_id}});
            }
        }
        response.status(200).json({theater: theater, actors: actors, shows: shows, areas: areas});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addTheater = async (request, response) => {
    try{
        let {name, description, areas} = request.body;
        if(!name || !description || !areas)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(await prisma.theaters.findFirst({where:{name:name}})) return response.status(400).json({message: 'Театр с таким именем уже существует'});
        let result = await prisma.theaters.create({
            data: {
                name: name,
                description: description,
                acting_area: {
                    createMany: {
                        data: areas
                    }
                }
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const deleteTheater = async (request, response) => {
    try{
        let theaterId = request.body.theaterId;
        if(!theaterId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.acting_area.deleteMany({
            where: {
                theater_id: theaterId
            },
        });
        await prisma.theaters.delete({where:{theater_id:theaterId}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateTheater = async (request, response) => {
    try{
        let {theaterId, name, description, areas} = request.body;
        if(!theaterId || !name || !description)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        
        if(areas.length >= 1){
            for(let item in areas){
                console.log(areas[item], item)
                if(!areas[item].num || !areas[item].capacity || !areas[item].area_id)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
                await prisma.acting_area.update({
                    where:{
                        area_id:areas[item].area_id
                    },
                    data:{
                        num:areas[item].num,
                        capacity:areas[item].capacity
                    }
                })
            }
        }
        await prisma.theaters.update({
            where:{
                theater_id:theaterId
            },
            data:{
                name:name,
                description:description
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getAll, getTheater, getAllTheaterInfo, addTheater, deleteTheater, updateTheater
}