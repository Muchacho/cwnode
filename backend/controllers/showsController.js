const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient()
const fs = require('fs');

const getAll = async (request, response) => {
    try{
        let shows = await prisma.shows.findMany();
        response.status(200).json(shows);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getShow = async (request, response) => {
    try{
        let show = await prisma.shows.findFirst({where:{show_id:+request.params['id']}});
        let schedule = await prisma.schedule.findMany({where:{show_id:show.show_id}});
        let date, resultSchedule = [];
        for(let item in schedule){
            date = new Date(schedule[item].start_time);
            console.log(date, new Date());
            if(new Date() > date){
                await prisma.bookedtickets.deleteMany({where:{schedule_id: schedule[item].schedule_id}});
                await prisma.schedule.delete({where: {schedule_id: schedule[item].schedule_id}});
            } else {
                resultSchedule.push(schedule[item]);
            }
        }
        let theaters = [];
        let startTime;
        for(let item in resultSchedule){
            theaters.push(await prisma.theaters.findUnique({where:{theater_id:resultSchedule[item].theater_id}}));
        }
        let result = {}, scheduleRes = [];
        for(let item in resultSchedule){
            startTime = resultSchedule[item].start_time;
            result = {
                schedule_id: resultSchedule[item].schedule_id,
                price: resultSchedule[item].price ? resultSchedule[item].price : 'Узнайте в кассе театра',
                start_time:resultSchedule[item].start_time,
                name: theaters[item].name
                }
            scheduleRes.push(result);
        }
        response.status(200).json({show:show, schedule: scheduleRes});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addShow = async (request, response) => {
    try{
        console.log(request.body);
        console.log(request.file);
        let {name, description, duration} = request.body;
        if(!name || !description || !duration)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(await prisma.shows.findFirst({where:{name:name}})) return response.status(400).json({message: 'Представление с таким именем уже существует'});
        let file = request.file, filename = `${performance.now()}${file.originalname}`;
        fs.writeFileSync(`./static/${filename}`, file.buffer);
        let result = await prisma.shows.create({
            data: {
                name: name,
                description: description,
                duration: +duration,
                rating: null,
                img_name: filename
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
        let showId = +request.params['id'];
        console.log(request.body);
        if(!showId)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.commets.deleteMany({where: {shows_id: showId}});
        await prisma.shows.delete({where:{show_id:showId}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateShow = async (request, response) => {
    try{
        console.log(request.body);
        let {show_id, name, description, duration} = request.body;
        if(!show_id || !name || !description || !duration)return response.status(400).json({message: 'Пожалуйста, заполните обязательные пол1я'});
        await prisma.shows.update({
            where:{
                show_id:show_id
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

const getComments = async (request, response) => {
    try{    
        let show_id = +request.params['id'];
        let comments = await prisma.commets.findMany({where:{shows_id: show_id}});
        let user;
        let result = [];
        for(let item in comments){
            user = await prisma.users.findUnique({where: {user_id: comments[item].user_id}});
            result.push({
                email: user.email,
                rating: comments[item].rating,
                comment: comments[item].comment
            });
        }
        response.status(200).json(result);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addComment = async (request, response) => {
    try{    
        let token = request.headers["authorization"].split(' ')[1];
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let show_id = +request.params['id'];
        let {rating, comment} = request.body;
        rating = +rating;
        if(!show_id || !rating || !comment)return response.status(400).json({message: 'Пожалуйста, заполните обязательные пол1я'});
        await prisma.commets.create({
            data:{
                user_id: data.id,
                shows_id: show_id,
                rating: rating,
                comment: comment
            }
        });
        let comments = await prisma.commets.findMany({where:{shows_id: show_id}});
        let commentsRating = [], k = 0, showRating = 0;
        for(let item in comments){
            k++;
            showRating+= comments[item].rating;
            commentsRating.push(comments.rating);
        }
        console.log(rating);
        await prisma.shows.update({
            where:{
                show_id: show_id
            },
            data: {
                rating : showRating/k
            }
        })
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getAll, getShow, addShow, deleteShow, updateShow, addComment, getComments
}

// let date = new Date();
// let datex = new Date('2023-06-06 14:00');

// console.log(date > datex);