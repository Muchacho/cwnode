const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const prisma = new PrismaClient()
const fs = require('fs');

const getAll = async (request, response) => {
    try{
        let theaters = await prisma.theaters.findMany();
        response.status(200).json(theaters);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTheater = async (request, response) => {
    try{
        let theater = await prisma.theaters.findFirst({where:{theater_id:+request.params['id']}});
        // let actors = await prisma.actors.findMany({where:{theater_id: theater.theater_id}});
        response.status(200).json(theater);
        // response.status(200).json({theater: theater, actors: actors});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTheatersWithAreas = async (request, response) => {
    try{
        let theaters = await prisma.theaters.findMany();
        let result = [], areas, areasString = '';
        for(let item in theaters){
            areas = await prisma.acting_area.findMany({
                where: {
                    theater_id: theaters[item].theater_id
                },
                select: {
                    num: true,
                    capacity: true
                }
            });
            for(let areasItem in areas){
                areasString+= `В ${areas[areasItem].num} зале ${areas[areasItem].capacity} мест. `;
            }
            if(areasString)
            result.push({
                name: theaters[item].name,
                areas: areasString
            })
            areasString = '';
        }
        console.log(result);
        response.status(200).json(result);
        // response.status(200).json({theater: theater, actors: actors});
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
        // response.status(200).json({theater: theater, actors: actors, shows: shows, areas: areas});
        response.status(200).json();
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addTheater = async (request, response) => {
    try{
        console.log(request.body);
        console.log(request.file);
        let {name, description, address} = request.body;
        if(!name || !description || !address)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        // if(!name || !description || !areas)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(await prisma.theaters.findFirst({where:{name:name}})) return response.status(400).json({message: 'Театр с таким именем уже существует'});
        let file = request.file, filename = `${performance.now()}${file.originalname}`;
        fs.writeFileSync(`./static/${filename}`, file.buffer);
        let result = await prisma.theaters.create({
            data: {
                name: name,
                description: description,
                address: address,
                img_name: filename
                // acting_area: {
                //     createMany: {
                //         data: areas
                //     }
                // }
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
        let theaterId = +request.params['id'];
        if(!theaterId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.acting_area.deleteMany({
            where: {
                theater_id: theaterId
            },
        });
        await prisma.schedule.deleteMany({where:{theater_id:theaterId}});
        await prisma.theaters.delete({where:{theater_id:theaterId}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateTheater = async (request, response) => {
    try{
        let {theater_id, name, description, address, areas} = request.body;
        if(!theater_id || !name || !description || !address)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        
        if(areas && areas.length >= 1){
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
                theater_id:theater_id
            },
            data:{
                name:name,
                description:description,
                address:address
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTheatersShows = async (request, response) => {
    try{
        let theaters = await prisma.theaters.findMany();
        response.status(200).json(theaters);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addArea = async (request, response) => {
    try{
        console.log(request.body);
        let {theater_id, num, capacity} = request.body;
        if(!theater_id || !num || !capacity)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        let area = await prisma.acting_area.findFirst({where:{theater_id:+theater_id, num: +num}});
        if(area)return response.status(400).json({message: 'Такой зал уже существует'});
        await prisma.acting_area.create({
            data: {
                theater_id: +theater_id,
                num: +num,
                capacity: +capacity
            }
        })
        let theaters = await prisma.theaters.findMany();
        response.status(200).json(theaters);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getAll, getTheater, getAllTheaterInfo, addTheater, deleteTheater, updateTheater, getTheatersWithAreas, addArea
}